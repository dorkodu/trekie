import { useAppStore } from "@/stores/appStore";
import { Flex, Modal } from "@mantine/core";

function EditProfileModal() {
  const editProfile = useAppStore(state => state.modals.editProfile);
  const close = () => useAppStore.setState(s => { s.modals.editProfile.opened = false })

  return (
    <Modal
      opened={editProfile.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Edit Profile"
    >
      <Flex direction="column" gap="md">
        EditProfileModal
      </Flex>
    </Modal>
  )
}

export default EditProfileModal