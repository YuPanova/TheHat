import { zip, flatMap, compact } from 'lodash';

export function mergeArrays(arr1: string[], arr2: string[]): { name: string, teamIndex: number }[]{
  return compact(
    flatMap(
      zip(arr1.map(item => ({name: item, teamIndex: 0})), arr2.map(item => ({name: item, teamIndex: 1})))
    )
  )
}

