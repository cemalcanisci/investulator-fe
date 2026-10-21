import type { AssetType } from '@/domain/assetTypes';

export interface WatchAsset {
  readonly id: string;
  readonly symbol: string;
  readonly name: string | null;
  readonly assetType: AssetType;
  readonly market: string | null;
  readonly pair: string | null;
  readonly providerId: string | null;
  readonly identityStatus: 'UNVERIFIED';
}

export interface StrategyInput {
  readonly name: string;
  readonly description: string;
  readonly targetWeight: string | null;
  readonly targetAssetCount: number | null;
}

export interface StrategyGroup extends StrategyInput {
  readonly id: string;
}

export interface WatchMembership {
  readonly groupId: string;
  readonly assetId: string;
}

export interface StrategySnapshot {
  readonly groups: readonly StrategyGroup[];
  readonly assets: readonly WatchAsset[];
  readonly memberships: readonly WatchMembership[];
}

export type StrategyCommand =
  | { readonly type: 'CREATE_GROUP'; readonly input: StrategyInput }
  | {
      readonly type: 'UPDATE_GROUP';
      readonly id: string;
      readonly input: StrategyInput;
    }
  | { readonly type: 'DELETE_GROUP'; readonly id: string }
  | {
      readonly type: 'ADD_ASSET';
      readonly groupId: string;
      readonly assetId: string;
    }
  | {
      readonly type: 'REMOVE_ASSET';
      readonly groupId: string;
      readonly assetId: string;
    };

export interface StrategyService {
  readonly fetch: () => Promise<StrategySnapshot>;
  readonly execute: (command: StrategyCommand) => Promise<StrategySnapshot>;
}

export interface StrategySessionChanges {
  readonly groups: readonly StrategyGroup[];
  readonly deletedGroupIds: readonly string[];
  readonly addedMemberships: readonly WatchMembership[];
  readonly removedMemberships: readonly WatchMembership[];
}

export interface DemoStrategyService extends StrategyService {
  readonly inspectSession: () => StrategySessionChanges;
}

export type AnalysisScope =
  | { readonly type: 'ALL' }
  | { readonly type: 'GROUP'; readonly groupId: string }
  | { readonly type: 'ASSET'; readonly assetId: string };

export interface AnalysisRequest {
  readonly scope: AnalysisScope;
  readonly mode: 'SMART' | 'FULL';
  readonly idempotencyKey: string;
}

export interface AnalysisJobItem {
  readonly assetId: string;
  readonly status:
    'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  readonly checkedAt: string | null;
  readonly reportId: string | null;
  readonly error: string | null;
}
