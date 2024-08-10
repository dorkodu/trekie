import { Flex, Image, Loader, Modal, Title } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const UpdateSWModal = ({ context, id, innerProps }: ContextModalProps<{}>) => {
  const {
    offlineReady: [_offlineReady, _setOfflineReady],
    needRefresh: [needRefresh, _setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!needRefresh) return
    setTimeout(() => updateServiceWorker(true), 500)
  }, [needRefresh])

  return (
    <>
      <Flex direction="column" gap="md" align="center">
        <Image src="/favicon.svg" w={100} h={100} />

        <Title order={4}>Updating the App!</Title>

        <Loader type="dots" />
      </Flex>
    </>
  )
}

export default UpdateSWModal
