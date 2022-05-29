import { Box, Container, Stack, StackDivider, Text } from '@chakra-ui/react'
import * as React from 'react'
import { PersonalInfoCard } from '../components/AddressCard'
import Layout from '../components/Layout'
import { ProfileCard } from '../components/ProfileCard'

export const MyProfile = () => (
    <Layout customTitle="My Profile" description="" >
        <PersonalInfoCard maxW={{ lg: '3xl' }} />

    </Layout>
)