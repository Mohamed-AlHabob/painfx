import { onInfiniteScroll } from "@/redux/features-slices/infinite-scroll-slice"
import { useAppSelector } from "@/redux/hooks"
import { AppDispatch } from "@/redux/store"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
export const useInfiniteScroll = () => {
  const observerElement = useRef<HTMLDivElement>(null)
  const dispatch: AppDispatch = useDispatch()
  const {  } = useAppSelector((state) => state.infiniteScroll)

  const {
    refetch,
    isFetching,
    isFetched,
    data: paginatedData,
  } = useQuery({
    queryKey: ["infinite-scroll"],
    queryFn: async () => {
      return null
    },
    enabled: false,
  })

  if (isFetched && paginatedData)
    dispatch(onInfiniteScroll({ data: paginatedData }))

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) refetch()
    })
    observer.observe(observerElement.current as Element)
    return () => observer.disconnect()
  }, [refetch])
  return { observerElement, isFetching }
}
