import { AsyncOptions, useAsync } from 'react-async'

export const useApi = (options: AsyncOptions<unknown>) => useAsync(options)
