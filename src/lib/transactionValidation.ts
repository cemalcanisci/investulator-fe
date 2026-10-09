import { TRANSACTION_TYPES } from '@/domain/assetTypes';
import { isTrade, type TransactionInput } from '@/domain/transaction';
import { compareDecimals, getSign } from '@/lib/decimal';
import { todayIso, validDate } from '@/lib/formatDate';
import { parseDecimalInput } from '@/lib/transactionForm';

/** Guards the ledger boundary as well as the form; a rejected batch must remain atomic. */
export function validateTransactionInput(input: TransactionInput): void {
  const positive = (value: string | null): boolean =>
    value !== null &&
    parseDecimalInput(value) === value &&
    getSign(value) === 'positive';
  const trade = isTrade(input.type);
  const cash = trade || input.type === 'DIVIDEND';
  const valid =
    TRANSACTION_TYPES.includes(input.type) &&
    validDate(input.executedAt) &&
    input.executedAt <= todayIso() &&
    (input.executedTime === undefined ||
      /^([01]\d|2[0-3]):[0-5]\d$/.test(input.executedTime)) &&
    (input.currency === 'USD' || input.currency === 'TRY') &&
    (input.fxRateSource === 'AUTO' || input.fxRateSource === 'MANUAL') &&
    (!cash || positive(input.fxRateToUsd)) &&
    (!cash ||
      input.currency !== 'USD' ||
      compareDecimals(input.fxRateToUsd, '1') === 0) &&
    (trade || input.type === 'BONUS'
      ? positive(input.quantity)
      : input.quantity === null) &&
    (trade ? positive(input.unitPrice) : input.unitPrice === null) &&
    (cash ? positive(input.totalAmount) : input.totalAmount === null) &&
    (input.type === 'SPLIT'
      ? positive(input.splitRatio)
      : input.splitRatio === null) &&
    (input.fee === null ||
      (trade &&
        parseDecimalInput(input.fee) === input.fee &&
        input.fee !== ''));
  if (!valid) {
    throw new Error('Invalid transaction input');
  }
}
