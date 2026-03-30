'use client'
import { fetcher } from '@/coingecko.action'
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/lib/constants'
import { cn, convertOHLCData } from '@/lib/utils'
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts'
import React, { useEffect, useRef, useState, useTransition } from 'react'

const CandleStickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) => {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState(initialPeriod)
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? [])
  const [isPending, startTransition] = useTransition()

  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  async function fetchOHLCData(selectedPeriod: Period) {
    const { days, interval } = PERIOD_CONFIG[selectedPeriod]

    try {
      const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        // days: days,
        days,
        precision: 2,
      })
      console.log(newData, '!@#!#!@#')
      setOhlcData(newData ?? [])
    } catch (error) {
      console.error('Failed to fetch OHLCData ', error)
    }
  }

  function handleClick(newPeriod: Period) {
    if (newPeriod === period) return

    // TODO UPDATE PERIOD
    startTransition(async () => {
      setPeriod(newPeriod)
      fetchOHLCData(newPeriod)
    })
  }

  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    const showTime = ['daily', 'weekly', 'monthly'].includes(period)

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    })
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig())
    series.setData(convertOHLCData(ohlcData))
    chart.timeScale().fitContent()

    //
    chartRef.current = chart
    candleSeriesRef.current = series

    //for resize the window when the browser window is also changed
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return
      chart.applyOptions({ width: entries[0].contentRect.width })
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove() // to avoid memory leak
      chartRef.current = null
      candleSeriesRef.current = null
    }
  }, [height])

  //to update when changin the period
  useEffect(() => {
    if (!candleSeriesRef.current) return

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0 / 1000]),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    )

    const converted = convertOHLCData(convertedToSeconds)

    candleSeriesRef.current.setData(converted)
    chartRef.current?.timeScale().fitContent()
  }, [ohlcData, period])
  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className="config-button"
              onClick={() => handleClick(value)}
              disabled={loading}
              className={
                period === value ? 'config-button-active' : 'config-button'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  )
}

export default CandleStickChart
