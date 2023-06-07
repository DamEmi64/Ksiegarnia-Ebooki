import { Button } from "@mui/material";
import React, { useContext } from "react";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import { NotificationContext } from "../../../../context/NotificationContext";
import EbookService from "../../../../services/EbookService";

const DeleteEbook = (props: { ebookId: string; handleAccept: () => void }) => {
  const [visibleDeleteConfirmation, setVisibleDeleteConfirmation] =
    React.useState<boolean>(false);

  const notificationContext = useContext(NotificationContext);

  const DELETED_SUCCESSFULY_MESSAGE = "Usunięto ebooka";
  const DELETED_FAILED_MESSAGE = "Nie udało się usunąć ebooka";

  const handleDelete = () => {
    EbookService.delete(props.ebookId)
      .then(() => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: DELETED_SUCCESSFULY_MESSAGE,
        });
        props.handleAccept();
      })
      .catch(() => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: DELETED_FAILED_MESSAGE,
        });
      });
  };

  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        style={{ borderRadius: 10 }}
        onClick={() => setVisibleDeleteConfirmation(true)}
      >
        Usuń
      </Button>
      <ConfirmationDialog
        message="Czy na pewno chcesz usunąć ebooka?"
        open={visibleDeleteConfirmation}
        handleDecline={() => setVisibleDeleteConfirmation(false)}
        handleAccept={handleDelete}
      />
    </React.Fragment>
  );
};

export default DeleteEbook;
