import { CoinOverviewFallback } from '@/app/Fallback'
import { fetcher } from '@/coingecko.action'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import CandleStickChart from '../shared/CandleStickChart'

const CoinOverview = async () => {
  let coin
  let coinOHLCData
  try {
    ;[coin, coinOHLCData] = await Promise.all([
      await fetcher<CoinDetailsData>('coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),

      await fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 2,
        // interval: 'hourly',
      }),
    ])
    // console.log('OHLC ', coinOHLCData)
  } catch (error) {
    console.log('Error fetching Coin:', error)
    return <CoinOverviewFallback />
  }

  return (
    <div id="coin-overview">
      <CandleStickChart data={coinOHLCData} coinId="bitcoin">
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
            <p>{formatCurrency(coin.market_data.current_price.usd)}</p>
          </div>
        </div>
      </CandleStickChart>
    </div>
  )
}

export default CoinOverview
