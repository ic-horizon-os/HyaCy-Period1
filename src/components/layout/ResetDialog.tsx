import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from '@fluentui/react-components';

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function ResetDialog({ open, onOpenChange, onReset }: ResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface className="dialog">
        <DialogBody>
          <DialogTitle>重置进度？</DialogTitle>
          <DialogContent>实验进度、知识笔记和得分都会清空，事件流回到初始状态。这一步撤不回。</DialogContent>
          <DialogActions className="dialogActions">
            <DialogTrigger disableButtonEnhancement>
              <Button className="btn btnSecondary" appearance="secondary">
                取消
              </Button>
            </DialogTrigger>
            <Button
              className="btn btnPrimary"
              appearance="primary"
              onClick={() => {
                onReset();
                onOpenChange(false);
              }}
            >
              重置
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
