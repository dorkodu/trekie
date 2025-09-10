import { IconClipboardText, IconDotsVertical, IconExclamationCircle, IconShare, IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@web/components/ui/action-icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@web/components/ui/dropdown-menu";
import { trekie } from "@web/lib/trekie";
import { IHabit } from "@web/namespaces/habit";
import { habits } from ".";

interface Props {
  habit: IHabit;
}

function HabitCounterMenu({ habit }: Props) {
  const currentUserId = trekie.use(($) => $.user?.id);
  const isHabitOwner = habit.userId === currentUserId;

  const onShare = (ev) => {
    ev.stopPropagation();
  };

  const onClipboard = (ev) => {
    ev.stopPropagation();
  };

  const onReport = (ev) => {
    ev.stopPropagation();
  };

  const onDelete = (ev) => {
    ev.stopPropagation();
    habits.delete(habit.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionIcon
          variant="ghost"
          color="gray"
          onClick={(ev) => ev.stopPropagation()}
          size="lg"
        >
          <IconDotsVertical className="text-gray-500" />
        </ActionIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-lg">
        <DropdownMenuItem onClick={onShare}>
          <IconShare className="mr-2 w-4 h-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClipboard}>
          <IconClipboardText className="mr-2 w-4 h-4" /> Copy To Clipboard
        </DropdownMenuItem>
        {currentUserId && (
          <>
            <DropdownMenuSeparator />
            {isHabitOwner ? (
              <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:bg-red-50">
                <IconTrash className="mr-2 w-4 h-4" /> Delete Habit
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onReport} className="text-red-600 focus:bg-red-50">
                <IconExclamationCircle className="mr-2 w-4 h-4" /> Report habit
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HabitCounterMenu;
