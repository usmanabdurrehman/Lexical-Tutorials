export const getSelectedBtnProps = (isSelected: boolean) =>
  isSelected
    ? {
        colorScheme: "gray",
        variant: "solid",
      }
    : { color: "#444" };
