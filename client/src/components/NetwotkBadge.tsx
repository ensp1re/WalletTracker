// import { useWeb3 } from "../context/Web3Context"

const NETWORKS: { [chainId: number]: { name: string; color: string } } = {
  1: { name: "Ethereum", color: "bg-blue-500" },
  137: { name: "Polygon", color: "bg-purple-500" },
  56: { name: "BSC", color: "bg-yellow-500" },
  // Add more networks as needed
}

export default function NetworkBadge() {
  // const { chainId } = useWeb3()

  // if (!chainId) return null

  const network = NETWORKS[0] || {
    name: `Chain ID: 1234`,
    color: "bg-gray-500",
  }

  return (
    <div
      className={`
      px-3 py-1 rounded-full text-white text-sm font-medium
      ${network.color}
    `}
    >
      {network.name}
    </div>
  )
}

