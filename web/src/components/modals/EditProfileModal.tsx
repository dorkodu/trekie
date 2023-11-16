import { useAppStore } from "@/stores/appStore";
import { Button, Flex, Modal, TextInput, Textarea } from "@mantine/core";

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

        <TextInput
          label="Username"
          placeholder="Username..."
        />

        <Textarea
          label="Bio"
          placeholder="Bio..."
          autosize
          minRows={3}
        />

        <Flex justify="end">
          <Button>
            Confirm
          </Button>
        </Flex>

      </Flex>
    </Modal>
  )
}

export default EditProfileModal