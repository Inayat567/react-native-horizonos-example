import { RootStackParamList } from "@/navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation as useNavigationNative } from "@react-navigation/native";

export const useNavigation = () => {
  return useNavigationNative<StackNavigationProp<RootStackParamList>>();
};