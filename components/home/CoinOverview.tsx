import { CoinOverviewFallback } from '@/app/Fallback'
import { fetcher } from '@/coingecko.action'
import { formatCurreny } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const CoinOverview = async () => {
  let coin
  try {
    coin = await fetcher<CoinDetailsData>('coins/bitcoin', {
      dex_pair_format: 'symbol',
    })
  } catch (error) {
    console.log('Error fetching Coin:', error)
    return <CoinOverviewFallback />
  }
  return (
    <>
      {' '}
      <div id="coin-overview">
        <div className="header pt-2">
          <Image
            // src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
            src={coin.image.large}
            alt={coin.name}
            height={56}
            width={56}
          />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <p>{formatCurreny(coin.market_data.current_price.usd)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoinOverview
