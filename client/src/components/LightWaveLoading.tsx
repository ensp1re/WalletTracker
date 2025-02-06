import type React from "react"

const LightWaveLoading: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div
            className={`bg-gradient-to-r from-gray-100 via-gray-100 to-gray-200 bg-[length:400%_100%] wave wave-animation ${className}`}
        />
    )
}

export default LightWaveLoading

