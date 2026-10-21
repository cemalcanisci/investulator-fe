import type {
  DemoStrategyService,
  StrategyCommand,
  StrategyInput,
  StrategySnapshot,
  WatchMembership,
} from '@/domain/strategy';
import { createStrategySeed } from '@/services/mockStrategies';

function validateGroup(
  input: StrategyInput,
  state: StrategySnapshot,
  id?: string,
): StrategyInput {
  const name = input.name.trim();
  if (!name || name.length > 80 || input.description.length > 500) {
    throw new Error('invalidGroup');
  }
  if (
    state.groups.some(
      (group) =>
        group.id !== id &&
        group.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'),
    )
  ) {
    throw new Error('duplicateGroup');
  }
  // Validate decimal syntax without converting financial values to binary floats.
  if (
    input.targetWeight !== null &&
    !/^(?:100(?:\.0{1,2})?|(?:\d|[1-9]\d)(?:\.\d{1,2})?)$/.test(
      input.targetWeight,
    )
  ) {
    throw new Error('invalidWeight');
  }
  if (
    input.targetAssetCount !== null &&
    (!Number.isSafeInteger(input.targetAssetCount) ||
      input.targetAssetCount < 1 ||
      input.targetAssetCount > 10000)
  ) {
    throw new Error('invalidCount');
  }
  return { ...input, name, description: input.description.trim() };
}

/** An isolated in-memory adapter; replacing it never requires changing portfolio services. */
export function createStrategyService(
  seed: StrategySnapshot = createStrategySeed(),
): DemoStrategyService {
  const baseline = structuredClone(seed);
  let state = structuredClone(baseline);
  function hasMembership(
    entries: readonly WatchMembership[],
    target: WatchMembership,
  ): boolean {
    return entries.some(
      (entry) =>
        entry.groupId === target.groupId && entry.assetId === target.assetId,
    );
  }
  function requireGroup(id: string): void {
    if (!state.groups.some((group) => group.id === id)) {
      throw new Error('missingGroup');
    }
  }
  return {
    inspectSession() {
      return structuredClone({
        groups: state.groups.filter(
          (group) =>
            JSON.stringify(group) !==
            JSON.stringify(
              baseline.groups.find((entry) => entry.id === group.id),
            ),
        ),
        deletedGroupIds: baseline.groups
          .filter(
            (group) => !state.groups.some((entry) => entry.id === group.id),
          )
          .map((group) => group.id),
        addedMemberships: state.memberships.filter(
          (entry) => !hasMembership(baseline.memberships, entry),
        ),
        removedMemberships: baseline.memberships.filter(
          (entry) => !hasMembership(state.memberships, entry),
        ),
      });
    },
    async fetch(): Promise<StrategySnapshot> {
      return structuredClone(state);
    },
    async execute(command: StrategyCommand): Promise<StrategySnapshot> {
      switch (command.type) {
        case 'CREATE_GROUP': {
          const input = validateGroup(command.input, state);
          state = {
            ...state,
            groups: [...state.groups, { ...input, id: crypto.randomUUID() }],
          };
          break;
        }
        case 'UPDATE_GROUP': {
          requireGroup(command.id);
          const input = validateGroup(command.input, state, command.id);
          state = {
            ...state,
            groups: state.groups.map((group) =>
              group.id === command.id ? { ...input, id: group.id } : group,
            ),
          };
          break;
        }
        case 'DELETE_GROUP':
          requireGroup(command.id);
          state = {
            ...state,
            groups: state.groups.filter((group) => group.id !== command.id),
            memberships: state.memberships.filter(
              (entry) => entry.groupId !== command.id,
            ),
          };
          break;
        case 'ADD_ASSET':
          requireGroup(command.groupId);
          if (!state.assets.some((asset) => asset.id === command.assetId)) {
            throw new Error('missingAsset');
          }
          if (
            state.memberships.some(
              (entry) =>
                entry.groupId === command.groupId &&
                entry.assetId === command.assetId,
            )
          ) {
            throw new Error('duplicateMembership');
          }
          state = {
            ...state,
            memberships: [
              ...state.memberships,
              { groupId: command.groupId, assetId: command.assetId },
            ],
          };
          break;
        case 'REMOVE_ASSET':
          requireGroup(command.groupId);
          state = {
            ...state,
            memberships: state.memberships.filter(
              (entry) =>
                entry.groupId !== command.groupId ||
                entry.assetId !== command.assetId,
            ),
          };
          break;
        default: {
          const exhaustive: never = command;
          return exhaustive;
        }
      }
      return structuredClone(state);
    },
  };
}

export const strategyService = createStrategyService();
