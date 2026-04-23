//Original fetch engine. Deprecated. Functionality handled by useQuery




import { DependencyList } from "react"
import { useEffect, useState } from "react"

export function useFetch<T>(fetchFn: () => Promise<T>, deps: DependencyList,enabled: boolean):{
  data: T | null
  loading: boolean
  error: string | null
}
{
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }
    let isCurrent = true; // lifecycle-based validation
    const runFetch  = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFn()
        if (isCurrent) {
          setData(data)
        }

      } catch (err) {
        if (isCurrent) {
          setError("Something went wrong. Please try again.")
          setData(null)
        }

      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    runFetch ()

    return () => {
      isCurrent = false  // invalidate this render
    }
}, deps)



return {data, loading, error}
}