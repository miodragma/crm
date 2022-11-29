import { useEffect } from "react";

const useOutsideClick = props => {

  const { actionsRef: ref, onRemoveSelect } = props;

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        onRemoveSelect()
      }
    }
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref, onRemoveSelect]);
}

export default useOutsideClick;
