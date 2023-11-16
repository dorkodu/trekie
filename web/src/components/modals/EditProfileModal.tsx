import { useAppStore } from "@/stores/appStore";
import { Flex, Modal, Paper } from "@mantine/core";
import ContentEditable from "../util/ContentEditable";

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
        <Paper withBorder p="xs">
          <ContentEditable />
        </Paper>
      </Flex>
    </Modal>
  )
}

export default EditProfileModal