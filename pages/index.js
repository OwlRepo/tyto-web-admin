import { ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  Fade,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { PageWrapper } from "../constant/components/";
import validateLogin from "../constant/services/authentication/login";

export default function Home() {
  const [isLoggingIn, setisLoggingIn] = useState(false);
  const toast = useToast()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onLogin = async () => {
    setisLoggingIn(true);
    const validationResult = await validateLogin({email:email,password:password})
    
    if(validationResult.success){
      Router.push({ pathname: "/admin" }).then(() => {
        localStorage.setItem('email',email),
        setisLoggingIn(false);
      });
    }
    else{
      toast({
        title: 'Login Failed',
        description: validationResult.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setisLoggingIn(false);
    }
  };

  

  return (
    <PageWrapper>
    <NextSeo 
      title="TYTO ADMIN | LOGIN"
      description="TYTO Admin LOGIN"
    />
      <Fade initialScale={"0.9"} in={!isLoggingIn} unmountOnExit={true}>
        <Center>
          <VStack alignItems={"stretch"} minW={"30vw"} mt={"30vh"}>
            <Heading color={"title"}>TYTO ADMIN</Heading>
            <Text color="subtitle">Fill out the fields below to continue.</Text>
            <Box h="5" />
            <Input shadow={"inner"} bg={"white"} placeholder={"Email"} onChange={event=>setEmail(event.target.value)} />
            <HStack> 
              <Input
                type="password"
                shadow={"inner"}
                bg={"white"}
                placeholder={"Password"}
                onChange={event=>setPassword(event.target.value)}
              />
              <IconButton icon={<ViewOffIcon />} />
            </HStack>
            <Box h="1" />
            <Button
              bg="solid_button"
              variant="solid"
              colorScheme={"blue"}
              marginTop={"10px"}
              onClick={onLogin}
            >
              <Text color="white">LOGIN</Text>
            </Button>
          </VStack>
        </Center>
      </Fade>
      <ScaleFade initialScale={"0.9"} in={isLoggingIn} unmountOnExit={true}>
        <Center>
          <VStack alignItems={"center"} minW={"5vw"} mt={"45vh"} spacing={"5"}>
            <Circles ariaLabel="loading-indicator" color="#548CA8" />
            <Heading
              color="title"
            >
              Loading
            </Heading>
          </VStack>
        </Center>
      </ScaleFade>
    </PageWrapper>
  );
}
