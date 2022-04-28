import { Box } from "@chakra-ui/layout"

export const Card: React.FC<CardProps> = ({children, ...props}) => {

    return (<Box borderRadius={5} borderWidth={2} p={5} mt={20} minW={350} shadow="md" {...props}>{children}</Box>)
}