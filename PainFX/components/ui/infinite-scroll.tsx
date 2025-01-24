import React from 'react';
import { useState } from "react"
import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native"

interface InfiniteScrollProps<T> {
  data: T[]
  renderItem: ({ item }: { item: T }) => React.ReactElement
  onEndReached: () => void
  loading: boolean
}

export function InfiniteScroll<T>({ data, renderItem, onEndReached, loading }: InfiniteScrollProps<T>) {
  const [loadingMore, setLoadingMore] = useState(false)

  const handleEndReached = () => {
    if (!loadingMore) {
      setLoadingMore(true)
      onEndReached()
      setLoadingMore(false)
    }
  }

  const renderFooter = () => {
    if (!loading) return null
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" />
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
})

