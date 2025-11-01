import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteSubjectSectionRate } from "@/api/admin/subject";
import { toast } from "sonner";

interface SubjectData {
  id: string;
  subjectId: string;
  subjectName: string;
  program: string;
  section: string;
  sections: any[];
}

interface DialogDeleteSubjectProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (value: boolean) => void;
  subjectToDelete: SubjectData | null;
  onRefresh?: () => void;
}

const DialogDeleteSubject: React.FC<DialogDeleteSubjectProps> = ({
  showDeleteDialog,
  setShowDeleteDialog,
  subjectToDelete,
  onRefresh,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;

    setIsDeleting(true);
    try {
      // Use the first section's id to delete all related sections
      const sectionId = subjectToDelete.sections[0]?.id;

      if (!sectionId) {
        toast.error("ไม่พบข้อมูล section ที่ต้องการลบ");
        return;
      }

      const response = await deleteSubjectSectionRate(sectionId);

      if (response.success) {
        toast.success(`ลบรายวิชา ${subjectToDelete.subjectName} สำเร็จ`);
        setShowDeleteDialog(false);

        // Refresh the data
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || "เกิดข้อผิดพลาดในการลบรายวิชา");
      }
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast.error(error?.message || "เกิดข้อผิดพลาดในการลบรายวิชา");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">ยืนยันการลบรายวิชา</DialogTitle>
          <DialogDescription className="text-gray-600">
            {subjectToDelete && (
              <div className="space-y-1">
                <p>คุณแน่ใจหรือไม่ที่จะลบรายวิชานี้?</p>
                <p className="font-semibold">
                  {subjectToDelete.subjectId} - {subjectToDelete.subjectName}
                </p>
                <p className="text-sm text-gray-500">
                  การดำเนินการนี้จะลบทุก section
                  ของรายวิชานี้และไม่สามารถยกเลิกได้
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDeleteSubject}
            disabled={isDeleting}
          >
            {isDeleting ? "กำลังลบ..." : "ลบรายวิชา"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSubject;
