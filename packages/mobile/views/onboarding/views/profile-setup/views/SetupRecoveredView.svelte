<script lang="ts">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'
    import features from '@features/features'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId } from '@core/network'
    import { profileSetupRouter } from '@/routers'
    import {
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        RestoreProfileType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }
    const networkId = $onboardingProfile?.network?.id
    const title = localize('views.onboarding.profileSetup.setupRecovered.title', {
        values: { network: getNetworkNameFromNetworkId(networkId) },
    })

    async function onProfileRecoverySelectionClick(restoreProfileType: RestoreProfileType): Promise<void> {
        isBusy = { ...isBusy, [restoreProfileType]: true }
        const type = getProfileTypeFromProfileRecoveryType(restoreProfileType)
        updateOnboardingProfile({ type, restoreProfileType })
        await initialiseProfileManagerFromOnboardingProfile(true)
        $profileSetupRouter.next()
    }

    function onBackClick() {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        void resetOnboardingProfileWithProfileManager()
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="import-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8"
            >{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text
        >
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            icon="language"
            busy={isBusy[RestoreProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[RestoreProfileType.Stronghold]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Stronghold)}
        />
    </div>
</OnboardingLayout>
