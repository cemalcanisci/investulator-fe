import { describe, expect, it } from 'vitest';
import { createStrategySeed } from '@/services/mockStrategies';
import { createStrategyService } from '@/services/strategies';
import { CATALOG } from '@/services/mockCatalog';
import { HOLDINGS } from '@/services/mockPortfolio';
import { fetchTransactions } from '@/services/transactions';
import type { StrategyInput } from '@/domain/strategy';

const input: StrategyInput = {
  name: 'Growth',
  description: '',
  targetWeight: null,
  targetAssetCount: null,
};

describe('strategy demo adapter', () => {
  it('seeds exactly ten stock and fifteen crypto memberships without financial claims', async () => {
    const data = await createStrategyService().fetch();
    expect(
      data.memberships.filter((entry) => entry.groupId === 'bist-dividend'),
    ).toHaveLength(10);
    expect(
      data.memberships.filter((entry) => entry.groupId === 'crypto-watch'),
    ).toHaveLength(15);
    expect(new Set(data.memberships.map((entry) => entry.assetId)).size).toBe(
      25,
    );
    for (const symbol of ['AI', 'VAI', 'ZK']) {
      expect(
        data.assets.find((asset) => asset.symbol === symbol),
      ).toMatchObject({
        providerId: null,
        market: null,
        name: null,
        identityStatus: 'UNVERIFIED',
        pair: `${symbol}USDT`,
      });
    }
    expect(
      data.groups.every(
        (group) =>
          group.targetWeight === null && group.targetAssetCount === null,
      ),
    ).toBe(true);
  });

  it('tracks session deltas separately and never changes seed, ledger, holdings or catalog', async () => {
    const seed = createStrategySeed();
    const original = structuredClone(seed);
    const transactions = await fetchTransactions();
    const holdings = structuredClone(HOLDINGS);
    const catalog = structuredClone(CATALOG);
    const service = createStrategyService(seed);
    expect(service.inspectSession()).toEqual({
      groups: [],
      deletedGroupIds: [],
      addedMemberships: [],
      removedMemberships: [],
    });
    const created = await service.execute({ type: 'CREATE_GROUP', input });
    const id = created.groups.at(-1)?.id ?? '';
    const assetId = 'watch-bist-tuprs';
    await service.execute({ type: 'ADD_ASSET', groupId: id, assetId });
    const data = await service.fetch();
    expect(data.assets.filter((asset) => asset.id === assetId)).toHaveLength(1);
    expect(
      data.memberships.filter((entry) => entry.assetId === assetId),
    ).toHaveLength(2);
    await service.execute({
      type: 'REMOVE_ASSET',
      groupId: 'bist-dividend',
      assetId,
    });
    expect(service.inspectSession()).toMatchObject({
      addedMemberships: [{ groupId: id, assetId }],
      removedMemberships: [{ groupId: 'bist-dividend', assetId }],
    });
    expect(seed).toEqual(original);
    expect(await createStrategyService().fetch()).toEqual(original);
    expect(await fetchTransactions()).toEqual(transactions);
    expect(HOLDINGS).toEqual(holdings);
    expect(CATALOG).toEqual(catalog);
  });

  it('edits targets, removes only the selected group memberships and retains catalog identities', async () => {
    const service = createStrategyService();
    await service.execute({
      type: 'UPDATE_GROUP',
      id: 'bist-dividend',
      input: {
        ...input,
        name: 'Dividend',
        targetWeight: '25.50',
        targetAssetCount: 12,
      },
    });
    expect((await service.fetch()).groups[0]).toMatchObject({
      name: 'Dividend',
      targetWeight: '25.50',
      targetAssetCount: 12,
    });
    await service.execute({ type: 'DELETE_GROUP', id: 'bist-dividend' });
    const data = await service.fetch();
    expect(data.groups).toHaveLength(1);
    expect(data.memberships).toHaveLength(15);
    expect(data.assets.some((asset) => asset.symbol === 'TUPRS')).toBe(true);
    expect(service.inspectSession().deletedGroupIds).toEqual(['bist-dividend']);
  });

  it.each(['', ' ', 'x'.repeat(81)])(
    'rejects invalid group name %s',
    async (name) => {
      await expect(
        createStrategyService().execute({
          type: 'CREATE_GROUP',
          input: { ...input, name },
        }),
      ).rejects.toThrow('invalidGroup');
    },
  );
  it.each(['-1', '100.01', 'NaN', '1e2', '1.234'])(
    'rejects invalid target weight %s',
    async (targetWeight) => {
      await expect(
        createStrategyService().execute({
          type: 'CREATE_GROUP',
          input: { ...input, targetWeight },
        }),
      ).rejects.toThrow('invalidWeight');
    },
  );
  it.each([0, -1, 1.5, 10001, NaN])(
    'rejects invalid target count %s',
    async (targetAssetCount) => {
      await expect(
        createStrategyService().execute({
          type: 'CREATE_GROUP',
          input: { ...input, targetAssetCount },
        }),
      ).rejects.toThrow('invalidCount');
    },
  );
  it.each(['0', '0.25', '100', '100.00'])(
    'accepts boundary weight %s as a string',
    async (targetWeight) => {
      const data = await createStrategyService().execute({
        type: 'CREATE_GROUP',
        input: { ...input, targetWeight },
      });
      expect(data.groups.at(-1)?.targetWeight).toBe(targetWeight);
    },
  );

  it('rejects duplicates, unknown references and oversized descriptions atomically', async () => {
    const service = createStrategyService();
    const before = await service.fetch();
    await expect(
      service.execute({
        type: 'CREATE_GROUP',
        input: { ...input, name: ' BIST Temettü ' },
      }),
    ).rejects.toThrow('duplicateGroup');
    await expect(
      service.execute({
        type: 'CREATE_GROUP',
        input: { ...input, description: 'x'.repeat(501) },
      }),
    ).rejects.toThrow('invalidGroup');
    await expect(
      service.execute({ type: 'UPDATE_GROUP', id: 'missing', input }),
    ).rejects.toThrow('missingGroup');
    await expect(
      service.execute({
        type: 'ADD_ASSET',
        groupId: 'missing',
        assetId: 'btc',
      }),
    ).rejects.toThrow('missingGroup');
    await expect(
      service.execute({
        type: 'ADD_ASSET',
        groupId: 'bist-dividend',
        assetId: 'missing',
      }),
    ).rejects.toThrow('missingAsset');
    await expect(
      service.execute({
        type: 'ADD_ASSET',
        groupId: 'bist-dividend',
        assetId: 'watch-bist-tuprs',
      }),
    ).rejects.toThrow('duplicateMembership');
    expect(await service.fetch()).toEqual(before);
  });
});
