import { IconClipboardText, IconDotsVertical, IconEdit, IconExclamationCircle, IconShare, IconTrash } from "@tabler/icons-react";
import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { modals } from "@web/lib/modals";
import { trekie } from "@web/lib/trekie";
import { goals, IGoal } from ".";

interface Props {
  goal: IGoal;
}

function GoalMenu({ goal }: Props) {
  const currentUserId = trekie.use(($) => $.user.id);

  const onShare = (ev) => {
    ev.stopPropagation();
  };
  const onReport = (ev) => {
    ev.stopPropagation();
  };
  const onClipboard = (ev) => {
    ev.stopPropagation();
  };

  const onEdit = (ev) => {
    ev.stopPropagation();
    modals.openContextModal({
      modal: "goalEditor",
      title: "Edit Goal",
      innerProps: {
        mode: "EDIT",
        goal,
      },
    });
  };

  const onDelete = (ev) => {
    ev.stopPropagation();
    goals.delete(goal.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDotsVertical className="text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 shadow-lg">
        <DropdownMenuItem
          onClick={onShare}
          className="flex gap-2 items-center"
        >
          <IconShare className="w-4 h-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onClipboard}
          className="flex gap-2 items-center"
        >
          <IconClipboardText className="w-4 h-4" /> Copy To Clipboard
        </DropdownMenuItem>
        {currentUserId && (
          <>
            <DropdownMenuSeparator />
            {currentUserId === goal.userId ? (
              <>
                <DropdownMenuItem
                  onClick={onEdit}
                  className="flex gap-2 items-center"
                >
                  <IconEdit className="w-4 h-4" /> Edit Goal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="flex gap-2 items-center text-red-600 focus:text-red-700"
                >
                  <IconTrash className="w-4 h-4" /> Delete Goal
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={onReport}
                className="flex gap-2 items-center text-red-600 focus:text-red-700"
              >
                <IconExclamationCircle className="w-4 h-4" /> Report Goal
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GoalMenu;
