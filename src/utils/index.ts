export const getSelectedBtnProps = (isSelected: boolean) =>
  isSelected
    ? {
        colorScheme: "blue",
        variant: "solid",
      }
    : { color: "#444" };
