import { INetworkFeatures } from '@lib/features/interfaces'

const networkFeatures: INetworkFeatures = {
    enabled: true,
    layer2: {
        enabled: true,
    },
    config: {
        enabled: false,
        addChain: {
            enabled: false,
        },
    },
}

export default networkFeatures
