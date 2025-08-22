import React from 'react'

const SmallHead = () => {
    return (
        <div className='bg-white shadow-md relative z-50'>
            <div className='flex flex-col sm:flex-row justify-between font-normal text-xs sm:text-xs text-[11px] text-gray-500 xl:mx-24 sm:mx-10 mx-2 py-2 gap-1'>
                <p className='text-center sm:text-left'>Pulsuz çatdırılma 50 AZN-dən yuxarı alışlarda</p>
                <p className='flex flex-col sm:flex-row gap-1 sm:gap-3 text-center sm:text-right'>
                    <span>+994 12 123 45 67</span>
                    <span>info@kuponum.az</span>
                </p>
            </div>
        </div>
    )
}

export default SmallHead