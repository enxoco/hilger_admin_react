import React from 'react'
import {Box, Flex} from '@chakra-ui/react'
import { Sidebar } from './Sidebar';
export type WrapperVariant = "small" | "regular"
interface WrapperProps {
    variant?: WrapperVariant

}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant="regular" }) => {
    return (
        <>
            <Box mt={0} mx='auto' maxW={variant === "regular" ? "100%" : "400px"} w="100%" >
                <Flex flexDirection="row">
                    <Sidebar />
                    <Box>{children}</Box>
                </Flex>
            </Box>

        </>
    );
}