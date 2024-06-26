import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophoneLines,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import UserAgreement from './UserAgreement';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

//회원 가입 화면

function UserSignup() {
  const [email, setEmail] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [nickName, setNickName] = useState('');
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [birthYear, setBirthYear] = useState('');
  // 이메일 비밀번호, 비번확인, 별명, 별명확인, 성별, 거주지, 출생연도 (1940-2022)

  let submitAvailable =
    emailAvailable &&
    nickNameAvailable &&
    password &&
    password === passwordCheck &&
    gender &&
    birthYear &&
    location;

  if (!emailAvailable) {
    submitAvailable = false;
  }
  const handleDomainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'custom') {
      setDomain('custom');
      setCustomDomain('');
    } else {
      setDomain(value);
      setCustomDomain(value);
    }
  };
  const handleCustomDomainClear = () => {
    setDomain('');
    setCustomDomain('');
  };

  function checkEmailExists() {
    axiosInstance
      .post('/user/checkEmail', { email })
      .then((response) => {
        setEmailAvailable(!response.data.exists);
        toast({
          title: response.data.exists ? '중복된 이메일' : '사용 가능한 이메일',
          description: response.data.exists
            ? '이미 사용 중인 이메일입니다.'
            : '사용 가능한 이메일입니다.',
          status: response.data.exists ? 'error' : 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
          containerStyle: {
            display: 'flex',
            justifyContent: 'center',
          },
        });
      })
      .catch((error) => {
        toast({
          title: '오류발생',
          description:
            '이메일 확인 중 오류가 발생했습니다. 다시 시도해 주세요.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
          containerStyle: {
            display: 'flex',
            justifyContent: 'center',
          },
        });
      });
  }

  function checkNicknameExists() {
    axiosInstance
      .post('/user/checkNickname', { nickname: nickName }) // "nickName" 변수를 "nickname" 키로 사용
      .then((response) => {
        setNickNameAvailable(!response.data.exists);
        toast({
          title: response.data.exists ? '중복된 별명' : '사용 가능한 별명',
          description: response.data.exists
            ? '이미 사용 중인 별명입니다.'
            : '사용 가능한 별명입니다.',
          status: response.data.exists ? 'error' : 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
          containerStyle: {
            display: 'flex',
            justifyContent: 'center',
          },
        });
      })
      .catch((error) => {
        toast({
          title: '오류발생',
          description: '별명 확인 중 오류가 발생했습니다. 다시 시도해 주세요.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
          containerStyle: {
            display: 'flex',
            justifyContent: 'center',
          },
        });
        console.error('Request failed:', error.response || error); // 오류 로그 추가
      });
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = event.target.value;
    setBirthYear(selectedYear);
  };
  const handleSubmit = () => {
    const fullEmail = `${email}@${customDomain || domain}`;
    if (submitAvailable) {
      axiosInstance
        .post('/user/signup', {
          email: fullEmail,
          password: password,
          nickname: nickName,
          gender: gender,
          birthYear: birthYear,
          location: location,
        })
        .then((response) => {
          // 성공적으로 저장되었을 때의 처리
          toast({
            title: '가입 성공',
            description: '회원가입이 성공적으로 완료되었습니다.',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
            containerStyle: {
              display: 'flex',
              justifyContent: 'center',
            },
          });
          navigate('/');
        })
        .catch((error) => {
          // 오류 발생시 처리
          toast({
            title: '가입 실패',
            description: '오류가 발생했습니다. 다시 시도해 주세요.',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
            containerStyle: {
              display: 'flex',
              justifyContent: 'center',
            },
          });
        });
    } else {
      toast({
        title: '오류',
        description: '입력한 정보를 다시 확인해주세요.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Center>
        <Card>
          <CardHeader>
            <Heading>○ 회원가입</Heading>
          </CardHeader>
          <CardBody>
            <FormControl mb={5}>
              <FormLabel>이메일</FormLabel>
              <Flex gap={2}>
                <Input
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(false); // 이메일을 변경할 때마다 emailAvailable을 false로 설정
                  }}
                  mr={2}
                  w={40}
                />
                @
                {domain === 'custom' ? (
                  <InputGroup w={40}>
                    <Input
                      placeholder="직접입력"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <InputRightElement>
                      <Button size="sm" onClick={handleCustomDomainClear}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                ) : (
                  <Select
                    w={40}
                    value={domain}
                    onChange={handleDomainChange}
                    placeholder="도메인 선택"
                  >
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="custom">직접 입력</option>
                  </Select>
                )}
                <Button variant="outline" onClick={checkEmailExists}>
                  중복확인
                </Button>
                {/*<Button onClick={handleEmailCheck}>중복확인</Button>*/}
              </Flex>
              <FormErrorMessage>이메일 중복체크를 해주세요.</FormErrorMessage>
            </FormControl>
            <FormControl mb={5}>
              {/*<FormControl mb={5} isInvalid={password.length === 0}>*/}
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
            </FormControl>
            <FormControl mb={5} isInvalid={password != passwordCheck}>
              <FormLabel>비밀번호 확인</FormLabel>
              <Input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
              <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!nickNameAvailable}>
              <FormLabel>별명 입력</FormLabel>
              <Flex gap={2}>
                <Input
                  type="text"
                  value={nickName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    setNickNameAvailable(false);
                  }}
                ></Input>
                <Button
                  size="md"
                  colorScheme="beige"
                  border="1px solid tomato"
                  borderRadius="full"
                >
                  <FontAwesomeIcon
                    icon={faMicrophoneLines}
                    style={{ color: '#ff711a' }}
                  />
                </Button>
                <Button variant="outline" onClick={checkNicknameExists}>
                  중복확인
                </Button>
              </Flex>
              <FormErrorMessage>별명 중복 확인을 해주세요.</FormErrorMessage>
            </FormControl>
            <FormControl mb={5}>
              <FormLabel>성별</FormLabel>
              <Select
                placeholder="성별 선택"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="남자">남자</option>
                <option value="여자">여자</option>
                <option value="기타">기타</option>
              </Select>
            </FormControl>
            {/*출생연도 입력 1940_2022까지*/}
            <FormControl mb={5}>
              <FormLabel>출생연도</FormLabel>
              <Select
                placeholder="출생연도 선택"
                value={birthYear}
                // onChange={(e = setGender(e.target.value))}
                onChange={handleYearChange}
              >
                {Array.from(
                  { length: 2022 - 1940 + 1 },
                  (_, index) => 1940 + index,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormControl>
            {/*  -------거주지 입력---------*/}
            <FormControl mb={5}>
              <FormLabel>거주지</FormLabel>
              <Select
                placeholder={'거주 지역 선택'}
                onChange={(e) => setLocation(e.target.value)}
              >
                {[
                  '서울',
                  '경기',
                  '강원',
                  '충청',
                  '경상',
                  '전라',
                  '제주',
                  '해외',
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>이용약관</FormLabel>
              <UserAgreement />
            </FormControl>
          </CardBody>
          <CardFooter>
            <Button
              w="100%"
              colorScheme={submitAvailable ? 'orange' : 'gray'}
              isDisabled={!submitAvailable}
              onClick={handleSubmit}
            >
              가입하기
            </Button>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
}

export default UserSignup;