# 한 줄 일기

[한 줄 일기](https://onelinediary.vercel.app/)는 메모를 쓰는 것처럼 한 줄씩 하루를 기록할 수 있는 일기 사이트입니다.

## 목차

- [목표](#목차)
- [빌드](#빌드)
- [서비스 시연](#서비스-시연)
- [도전 과제](#도전-과제)
  - [무한 스크롤 적용](#무한-스크롤-적용)
    - [IntersectionObserver API 사용](#intersectionobserver-api-사용)
  - [반응형 제작](#반응형-제작)
  - [Unit Test](#unit-test)
    - [Test Util](#test-util)
    - [그리고...](#그리고)
  - [최적화](#최적화)
    - [Code splitting](#code-splitting)
  - [타임존 문제](#타임존-문제)
- [프레임워크](#프레임워크)
- [설치](#설치)
- [일정](#일정)
- [만든 사람](#만든-사람)

## 목표

평소 좋아하는 일기 쓰기 방식인 '메모'를 쓰는 것처럼 일기를 쓸 수 있는 사이트를 리액트로 구현하는 것이 이번 프로젝트의 목표였습니다.

## 빌드

- Client: Vercel
- Server: Railway
- Url: <https://onelinediary.vercel.app/>

## 서비스 시연

![Screenshot](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/1a8df9cd-e3e7-4b7a-a0e8-7e4fcb7addf9)

<details>
<summary>다크모드</summary>
<div markdown="1" >
 
  ![theme](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/666a1b06-1c84-48e7-9f93-875896ffd361)
</div>
</details>

<details>
<summary>반응형</summary>
<div markdown="1" >
  
  ![responsive gif](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/031a562c-7201-4ae9-9df5-f8bfa3c576fc)
</div>
</details>

## 도전 과제

## 무한 스크롤 적용

모바일 환경을 고려 하여, 일기 목록을 보여 줄 때 좀 더 좋은 사용자 경험을 주기 위해 무한 스크롤을 사용하였습니다.

### IntersectionObserver API 사용

IntersectionObserver는 설정한 요소가 브라우저 뷰포트 내에 보이거나 숨겨졌는지 여부를 비동기적으로 감지합니다.

```jsx
...
import useIntersection from "../hooks/useIntersection.js";
..
const Diary = () => {
    ..
    const isLoaded = useSelector((state) => state.diary.isLoaded);

    const ref = useIntersection(() => {
    dispatch(fetchScrollDiaryData());
    });

    const styles = { textAlign: "center" };
    return (
    ..
        {isLoaded && (
        <p style={styles} ref={ref}>
            Loding . . .
        </p>
        )}
..
    );
};
..
```

이를 이용하여 요소의 ref를 반환하는 `useIntersection`라는 커스텀 훅을 만들었습니다. 뷰포트에 관찰 대상이 보일 경우 새로운 데이터를 가져옵니다. 새로운 데이터를 가져올 때마다 관찰 대상을 새로이 지정해 주기 위해 `isLoaded` 상태 값을 사용합니다.

## 반응형 제작

모바일, 데스크탑 2가지의 반응형으로 제작했습니다. 데스크탑 사이즈로 간단한 목업 페이지를 만든 후 미디어 쿼리를 사용하여 반응형을 적용했습니다.

## Unit Test

테스트 작성이 익숙지 않아 일단은 라인 커버리지 60퍼센트를 목표로 삼았고 약 90퍼센트의 라인 커버리지를 달성했습니다.

### Test Util

testing-library/react, jest 사용

```jsx
import { render as rtlRender } from "@testing-library/react";

function render(
  ui,
  { preloadedState = {}, store = storeR, ...renderOptions } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { render };
```

```jsx
// 아래와 같이 사용 가능
tree = render(<Footer />);
```

Redux를 사용하기 위해서는 Provider 안에서만 사용해야 합니다. 하지만 테스트 시 Redux를 사용하는 컴포넌트마다 Provider를 생성하는 것은 반복되고 비효율적인 방법이라 생각하여  Redux 공식 홈페이지를 참고하여 `testUtil`을 만들어 사용하였습니다.

### 그리고...

사실 실무에서는 프로젝트 일정 때문에 테스트 코드를 작성하지 못하거나, 한다면 정말 정말 중요한 기능만 간략히 작성 후 넘어가는 경우가 많았습니다.  
이번 기회에 테스트 코드를 한번 적용해 보자고 생각했었으나 정확히 무엇을 테스트 할 것인지, 또 한다면 어디까지 테스트 할 것인지 목적과 기준을 정하는 부분에 있어 많이 헤매었습니다.  
단순히 의미 없이 라인 커버리지 수치를 높이려 할 것이 아니라 테스트 코드에 대한 목적과 기준을 명확히 세우고 테스트를 진행해야 한다는 것을 배웠습니다.

## 최적화

### Code splitting

![mobile_main](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/6521b0f2-10cf-42bc-bd82-563f57e97636)  
![before_codeSplit](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/d58e700e-b1e5-4bcc-9187-cb055ad7e09b)

lighthouse의 largest contentful paint(LCP)와 total blocking time가 좋지 못했기 때문에 저하의 여러 원인 중 하나인 클라이언트 측 렌더링을 개선 하기 위해 `cra-bundle-analyzer`를 이용하여 번들을 분석하였습니다.

```jsx
...
import BeatLoader from "react-spinners/BeatLoader";
...
const Home = lazy(() => import("./pages/Home"));
const New = lazy(() => import("./pages/New"));
const Diary = lazy(() => import("./pages/Diary"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
    return (
    <BrowserRouter>
        <Suspense
        fallback={<BeatLoader color="#d66b36" cssOverride={{}} size={10} />}
        >
                    ...
            <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/new" element={<New />}></Route>
            <Route path="/diary" element={<Diary />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/*" element={<NotFound />}></Route>
            </Routes>
                    ...
        </Suspense>
    </BrowserRouter>
    );
}

export default App;
```

개선을 위해 사용자가 필요하지 않은 코드를 불러오지 않게 하며, 앱의 초기화 로딩에 필요한 비용을 줄여주는 코드 번들을 도입하기로 하였고, 공식 문서가 제시하는 Route-based code splitting이라는 방법을 진행하여 번들 크기를 줄였습니다. 그 결과 아래와 같이 개선되었습니다.  
![mobile_main_after](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/82b76b76-d86f-4690-87ad-3ebdee6946de)
![after_codesplit](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/e5c7b0bf-8f63-49c3-aa98-4d044c5453ad)

## 타임존 문제

사실 실무에서는 설정이 이미 다 되어있는 상태에서 작업을 했기 때문에 크게 의식하지 못했던 부분이었습니다만, 처음부터 설정하다 보니 서버와 데이터베이스는 UTC 타임존을 사용하고 있었고 이를 단순히 서버 타임존을 한국시간으로 변경하여 해결해서는 안 된다고 생각했습니다.  
사용자 측에서는 서버에 저장된 데이터와 상관없이 본인의 시간대를 기준으로 시간이 표시되어야 한다고 생각했고 이를 클라이언트 측에서 작업하기로 했습니다.

```jsx
import moment from "moment";

export const getStringDate = (date, isEndDate) => {
  const currentDate = date ? new Date(date) : new Date();
  if (isEndDate) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return moment(currentDate).format("YYYY.MM.DD");
};

export const getSearchDate = (date, isEndDate) => {
  const localDate = new Date(getStringDate(date, isEndDate));
  const utcTime = moment.utc(localDate).format();
  return utcTime;
};
```

저장된 UTC 타임존 날짜를 본인의 시간대에 맞게 표시하고, moment 라이브러리를 사용하여 조회 시에도 본인의 시간대를 UTC로 조회할 수 있도록 하였습니다.  
![moment](https://github.com/one-line-diary-project/onelinediary-client/assets/139197409/1067b4d3-8ac9-4f14-86ff-35ea02928a6f)

## 프레임워크

| Frontend      | Backend  |
| ------------- | -------- |
| React         | Express  |
| Redux-toolkit | mongoose |
| CSS Module    |          |

## 설치

- 클라이언트

1. google OAuth 2.0 클라이언트 ID를 발급 받습니다.
2. 프로젝트 다운 후 아래의 명령어 실행 합니다.

```
npm start
```

3. 디렉토리 root 위치에 .env 파일을 생성 후 아래의 공란을 입력합니다.

```
REACT_APP_BASE_URL = ''
REACT_APP_DIARY_URL = ''
REACT_APP_GOOGLE_CLIENT_ID = ''
REACT_APP_GOOGLE_SECRET = ''
REACT_APP_GOOGLE_REDIRECT = ''
```

- 서버

```
npm run start-dev
```

## 일정

- 09.13 ~ 09.15 : 기획, Mock-up 작업
- 09.20 ~ 09.22 : 컴포넌트 작업, 반응형 작업
- 09.24 ~ 09.26 : 무한 스크롤 작업
- 09.28, 10.03 ~ 10.04 : 로그인 작업 및 css 보완 작업
- 10.09 ~ 10.10 : 다크 모드 작업
- 10.11 ~ 10.13 : 테스트 코드 작성
- 10.16 ~ 10.17 : 반응형 보완 작업 및 배포
- 10.18 ~ : 리팩토링

## 만든 사람

- 김지수 <keem3929@gmail.com>
