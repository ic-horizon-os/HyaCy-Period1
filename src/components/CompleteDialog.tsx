import { Flag24Filled } from '@fluentui/react-icons';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components';

interface CompleteDialogProps {
  open: boolean;
  score: number;
  onClose: () => void;
}

export function CompleteDialog({ open, score, onClose }: CompleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className="dialog">
        <DialogBody>
          <DialogTitle>
            <Flag24Filled className="dialogIcon" /> 全部实验完成
          </DialogTitle>
          <DialogContent>
            7 个实验全部完成，最终得分 {score}。右侧的知识笔记记下了每个实验的结论，
            每个实验页末尾都留着对应的防护建议。
          </DialogContent>
          <DialogActions className="dialogActions">
            <Button className="btn btnPrimary" appearance="primary" onClick={onClose}>
              回看实验
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
