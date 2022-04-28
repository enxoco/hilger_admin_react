import { Box, Flex, Stack, Text, Wrap, WrapItem } from "@chakra-ui/layout"
import { withUrqlClient } from "next-urql"
import React from "react"
import { Layout } from "../components/Layout"
import { useMeQuery, useViewProfileQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { Avatar } from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const Index = () => {
  const [{ data: meData }] = useMeQuery()

  const [{ data }] = useViewProfileQuery()

  if (!data) {
    return <div>who is you?</div>
  }
  return (
    <Layout>
              <WidgetLoader /> // add to top of file. Only use once.  

      {!data ? (
        <div>loading...</div>
      ) : (
        <Stack>
          <Flex p={5} shadow="md" borderWidth="1px">
            <Box flex={1}>

              <Wrap>
                <WrapItem>

                  <Avatar size="2xl" name={data.me?.username} src={data.me?.avatar} />
                  <EditIcon onClick={() => {}}/>
                </WrapItem>

              </Wrap>
              <Text>username: {data.me?.username}</Text>
              <Text>email: {data.me?.email}</Text>
            </Box>
          </Flex>
          <Widget
        sources={['local', 'camera']} 
        resourceType={'image'} // optionally set with 'auto', 'image', 'video' or 'raw' -> default = 'auto'
        cloudName={'the_murphs'} // your cloudinary account cloud name. 
        // Located on https://cloudinary.com/console/
        uploadPreset={'d1um57tt'} // check that an upload preset exists and check mode is signed or unisgned
        buttonText={'Open'} // default 'Upload Files'
        style={{
              color: 'white',
              border: 'none',
              width: '120px',
              backgroundColor: 'green',
              borderRadius: '4px',
              height: '25px'
            }} // inline styling only or style id='cloudinary_upload_button'
        folder={'my_folder'} // set cloudinary folder name to send file
        cropping={false} // set ability to crop images -> default = true
        onSuccess={successCallBack} // add success callback -> returns result
        onFailure={failureCallBack} // add failure callback -> returns 'response.error' + 'response.result'
        logging={false} // logs will be provided for success and failure messages, 
        // set to false for production -> default = true
        // customPublicId={'sample'} // set a specific custom public_id. 
        // To use the file name as the public_id use 'use_filename={true}' parameter
        eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'} // add eager transformations -> deafult = null
        use_filename={false} // tell Cloudinary to use the original name of the uploaded 
        // file as its public ID -> default = true,
/>
        </Stack>
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index)
