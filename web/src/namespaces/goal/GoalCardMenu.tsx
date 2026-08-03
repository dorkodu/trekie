import { IconClipboardText, IconDotsVertical, IconEdit, IconExclamationCircle, IconShare, IconTrash } from "@tabler/icons-react";
import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
// import { modals } from "@web/lib/modals";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { error, success } from "@web/lib/notifications/system";
import { trekie } from "@web/lib/trekie";
import { goals, IGoal } from ".";

interface Props {
  goal: IGoal;
}

function GoalMenu({ goal }: Props) {
  const currentUserId = trekie.use(($) => $.user.id);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const buildGoalURL = (goalId: string) => `${window.location.origin}/goal/${goalId}`;

  const onShare = async (ev) => {
    ev.stopPropagation();
    const url = buildGoalURL(goal.id);
    try {
      // Try native share on supported devices
      const navAny = globalThis.navigator as unknown as {
        share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>
        clipboard?: { writeText: (text: string) => Promise<void> }
      } | undefined;
      if (navAny?.share) {
        await navAny.share({ title: goal.title, text: goal.description, url });
        success("Share sheet opened");
        return;
      }
      if (navAny?.clipboard?.writeText) {
        await navAny.clipboard.writeText(url);
        success("Link copied to clipboard");
        return;
      }
      // Fallback to legacy approach
      success("Link copied to clipboard");
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    } catch (e) {
      error("Share failed", "Couldn’t share or copy the link.");
    }
  };
  const onReport = (ev) => {
    ev.stopPropagation();
  };
  const onClipboard = async (ev) => {
    ev.stopPropagation();
    const url = buildGoalURL(goal.id);
    try {
      const navAny = globalThis.navigator as unknown as { clipboard?: { writeText: (text: string) => Promise<void> } } | undefined;
      if (navAny?.clipboard?.writeText) {
        await navAny.clipboard.writeText(url);
        success("Link copied to clipboard");
        return;
      }
      // Fallback to legacy approach
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      success("Link copied to clipboard");
    } catch (e) {
      error("Copy failed", "Couldn’t copy the link.");
    }
  };

  const onEdit = (ev) => {
    ev.stopPropagation();
    navigate({ to: '/goal/$goalId/edit', params: { goalId: goal.id } })
  };

  const onDelete = async (ev) => {
    ev.stopPropagation();
    await goals.delete(goal.id);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["goals", currentUserId] }),
      qc.invalidateQueries({ queryKey: ["goal", goal.id] }),
      qc.invalidateQueries({ queryKey: ["goal-progress", goal.id] }),
    ]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDotsVertical className="size-6 text-gray-400" />
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
