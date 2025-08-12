import React, { useEffect } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
    interval?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol, interval = '1D' }) => {
    useEffect(() => {
        console.log('Mounting TradingViewWidget');
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            if (window.TradingView) {
                // @ts-ignore
                new window.TradingView.widget({
                    container_id: 'tradingview_chart_container',
                    width: '100%',
                    height: 500,
                    symbol: symbol,
                    interval: interval,
                    timezone: 'Etc/UTC',
                    theme: 'dark',
                    style: '1',
                    locale: 'en',
                    toolbar_bg: '#f1f3f6',
                    enable_publishing: true,
                    allow_symbol_change: true,
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    studies: ['MACD@tv-basicstudies'], // ✅ Add MACD indicator
                    details: true,
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            console.log('Unmounting TradingViewWidget');
            document.body.removeChild(script);
        };
    }, [symbol, interval]);

    return (
        <div className="w-full">
            <div id="tradingview_chart_container" className="w-full" />
        </div>
    );
};

export default TradingViewWidget;
