import type { CostItem } from '../types';

/** 필수 비용 합계 계산 */
export function calculateRequiredCost(items: CostItem[]): number {
  return items.filter((item) => item.required).reduce((sum, item) => sum + item.amount, 0);
}

/** 전체 비용 합계 계산 */
export function calculateTotalCost(items: CostItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

/** 금액을 한국 원화 형식으로 포맷 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}
