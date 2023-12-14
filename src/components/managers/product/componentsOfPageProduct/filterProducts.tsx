import React, { FC } from 'react';
import {
  GetProductsPagedRequest,
  common_OrderFactor,
  common_SortFactor,
  common_FilterConditions,
} from 'api/proto-http/admin';

interface FilterProps {
  filter: GetProductsPagedRequest;
  filterChange: (
    key: keyof GetProductsPagedRequest | keyof common_FilterConditions,
    value: any,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export const Filter: FC<FilterProps> = ({ filter, filterChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <select
        value={filter.sortFactors}
        onChange={(e) => filterChange('sortFactors', [e.target.value as common_SortFactor])}
      >
        <option value='SORT_FACTOR_CREATED_AT'>cr at</option>
        <option value='SORT_FACTOR_UPDATED_AT'> up at</option>
        <option value='SORT_FACTOR_NAME'>n</option>
        <option value='SORT_FACTOR_PRICE'>p</option>
      </select>
      <select
        name='orderFactor'
        value={filter.orderFactor}
        onChange={(e) => filterChange('orderFactor', e.target.value as common_OrderFactor)}
      >
        <option value='ORDER_FACTOR_ASC'>asc</option>
        <option value='ORDER_FACTOR_DESC'>desc</option>
      </select>

      <input
        type='number'
        value={filter.filterConditions?.from}
        onChange={(e) => filterChange('from', e.target.value)}
        placeholder='from'
      />
      <input
        type='number'
        value={filter.filterConditions?.to}
        onChange={(e) => filterChange('to', e.target.value)}
        placeholder='to'
      />
      <input
        type='text'
        value={filter.filterConditions?.color}
        onChange={(e) => filterChange('color', e.target.value)}
        placeholder='color'
      />
      <input
        type='number'
        value={filter.filterConditions?.categoryId}
        onChange={(e) => filterChange('categoryId', parseInt(e.target.value))}
        placeholder='category'
      />
      <input
        type='text'
        value={filter.filterConditions?.byTag}
        onChange={(e) => filterChange('byTag', e.target.value)}
        placeholder='tag'
      />
      <input
        type='number'
        value={
          filter.filterConditions?.sizesIds !== undefined
            ? String(filter.filterConditions.sizesIds)
            : ''
        }
        onChange={(e) => filterChange('sizesIds', e.target.value.split(',').map(Number))}
      />
      <button type='submit'>Apply Filters</button>
    </form>
  );
};
