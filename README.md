# 🐻‍❄️POLAR TOWN🐻‍❄️ - 백엔드 파트

메일함 비우기를 통하여 얻을 수 있는 콜라로 북극곰 마을을 꾸밀 수 있는 소셜 웹 앱

❄️ [폴라타운 놀러가기](https://polartowns.com/)<br/>
❄️ [프론트엔드 Repository](https://github.com/polar-town/polar-town-frontend)

## ✔️ 폴라타운 소개

본 프로젝트를 기획하면서 "디지털 탄소 발자국"에 대해 생각하게 되었습니다. 우리가 만든 프로젝트의 데이터 트래픽은 물론, 사용자들이 사용하는 디지털 기기에서 발생하는 탄소 배출, 이러한 탄소 배출을 0으로 만들 수 없다면, "탄소배출을 줄이는데 도움을 줄 수 있는 사이트를 만들어 보자" 라는 아이디어에서 폴라타운이 시작되었습니다!

메일함의 경우 신경쓰지 않으면 어느새 꽉 차버리지는 않으신가요? 가득 쌓인 메일을 삭제해 주는 것 만으로도 탄소 배출을 줄일 수 있습니다. 스팸메일을 보관하는데 연간 1,700만 톤의 이산화 탄소가 발생한다는 사실! 메일함을 비우며 탄소 배출 줄이기에 관심을 가져보세요, 그리고 폴라타운의 소셜기능들을 이용하여 친구들과 지속적인 활동을 이어나가 보는 것은 어떨까요?

## 💻 실행 방법
### 원격 저장소 내려받기
```
$ git clone https://github.com/polar-town/polar-town-backend.git
$ npm install
```
### 환경 변수 설정
```
REFRESH_TOKEN_MAX_AGE="..."
ACCESS_TOKEN_MAX_AGE="..."
ACCESS_TOKEN_SECRET="..."
CLIENT_URL=http://localhost:3000
DB_URL="..."
```
### 실행
```
$ npm start
```
### 테스트
```
$ npm test
```

### ⏰개발기간
- 2022년 02월 04일 ~ 2022년 02월 18일
    
## ⚙ 기술스택

### Language : <img alt="JavaScript" src ="https://img.shields.io/badge/JavaScript-F7DF1E.svg?&style=for-the-appveyor&logo=JavaScript&logoColor=white"/>

### Deploy : <img alt="AmazonAWS" src ="https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-appveyor&logo=amazon-aws&logoColor=white"/>

### Backend : <img alt="Node.js" src ="https://img.shields.io/badge/Node.js-43853D?style=for-the-appveyor&logo=node.js&logoColor=white"/> , <img alt="Express.js" src ="https://img.shields.io/badge/Express.js-404D59?style=for-the-appveyor"/> , <img alt="mongoDB" src ="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-appveyor&logo=mongodb&logoColor=white"/>

### [📕 API Docs](https://nebula-cemetery-b32.notion.site/API-Docs-deb906d444164b039e3e4344e5727f4e)

## 🚀 챌린지

<details><summary><b>Google OAuth 2.0으로 Gmail API 호출 가능한 Access Token 요청하기</b>
</summary>
<b>Firebase의 한계점</b><p>
프로젝트 초기에는 Firebase Auth의 Google 로그인을 사용하여 Gmail API 요청에 사용할 Access Token을 받아오는 방식으로 구현하였으나, 로그인 시 최초 발급받은 Google Access Token이 1시간 이후에 만료되는 이슈가 발생하였습니다. Firebase Auth는 권한 부여(Auth Z) 보다는 인증(AuthN)에 포커스를 두고 있기 때문에 ID Token은 갱신할 수 있으나, Google Access Token은 최초 발급 이후 갱신할 수 있는 메소드를 제공하고 있지 않다는 것을 알게 되었습니다.</p>
<b>Google OAuth 2.0으로 새로운 Auth Response 받기</b></br>
이에 대한 해결책으로 Google OAuth 2.0으로 로그인 방식을 변경하여 1시간이 지나 만료된 Google Access Token을 갱신할 수 있게 되었습니다. 이에 Google Access Token이 만료되면 로그아웃 후 재 로그인하여 새로운 Google Access Token을 받는 기존 방식에서, 로그인을 유지하며 Google Access Token을 갱신할 수 있는 방식으로 변경하여 재로그인 과정을 없애 서버 요청 간소화 및 사용자 경험을 개선의 효과가 있었습니다.
</details>

<details><summary><b>Gmail API의 Get 요청 반환 값이 Base64 문자열일 때의 Mail Body 렌더링</b>
</summary>
<b>Base64 문자열에 대한 이해</b><p>
Gmail API로 message에 대한 get 요청 시 mail body 반환 값이예상했던 HTML 문자열이 아닌 생소한 형태라 데이터 이해에 어려움이 있었습니다. 공식 문서를 찾아보니 인코딩된 base64url 문자열 형태임을 알게 되었습니다. 이메일은 문자 전송뿐만 아니라 음악 파일이나 그래픽 파일 등 첨부 파일로 바이너리 데이터를 포함하는 경우가 흔하기 때문에, 하드웨어나 운영체제에 관계없이 동일한 인코딩을 보장해주는 64개의 ASCII 문자로 인코딩된 base64 문자열 형식으로 전송한다는 것을 새롭게 배울 수 있었습니다.<br>
<b>
Base64 문자열 예시 👉 <i>Encoded:</i> dGVzdA== <i>Decoded:</i> test
</b>

</p>
<b>서버 에서 디코딩을 하게 된 이유</b><br>
디코딩해서 얻게 될 문자열이 전부 영문으로 이루어져 있어 ASCII 문자만으로 대응이 된다면 클라이언트에서 atob()를 사용한 디코딩을 우선으로 고려할 수 있습니다. 그러나 한국어 서비스를 제공하는 프로젝트이므로 대부분의 이메일에 한글이 포함되어 있을 것으로 예상하여 유니코드 문자열에 대한 디코딩이 필요하다고 판단, Node의 Buffer 클래스를 사용한 유틸 함수를 작성하여 디코딩 시 유실되는 문자열이 없도록 작업하였습니다. 
</details>

<details><summary><b>얼음 좌표 구하기</b>
</summary>
사용자가 아이템을 움직일 때 얼음 위에서만 마음대로 위치시키고 싶었기 때문에 이 부분에 있어서 고민을 꽤 많이 했었습니다. 처음에는 마우스의 절대좌표를 이용해 위치할 수 있는 좌표인지 판별하려고 했으나 유동적인 스크린 창에 대응하는 부분에 있어서 할 수 없다고 판단하여 다른 방법을 모색하였습니다. 얼음 이미지는 큰 div 태그 하나에 백그라운드 이미지로 보이고 있는 상황이었기 때문에 div 태그 기준으로 다이아몬드인 얼음 모양에 맞춰서 모서리 네 부분만 제약을 걸어야 했습니다. 얼음이 들어있는 큰 div 태그를 전체 좌표라고 생각하고 얼음 가운데를 (0,0) 좌표로 봤을 때 각각 4개의 일차함수로 이루어진 모양이라고 생각했습니다. 따라서 얼음 이미지 모양대로 4개의 일차함수를 그려 그 안을 지나는 좌표 일 때만 아이템을 위치 시키는 방법으로 해결하였습니다. 그 결과 저희가 원하던 모습대로 얼음을 제외하는 좌표에는 아이템을 위치시킬 수 없도록 제약을 걸 수 있었고 10가지의 얼음 좌표에 모두 유틸 함수 하나로 손쉽게 판별할 수 있었습니다. 저희 팀원들끼리 이 부분을 해결하지 못하면 어쩔 수 없이 아무 곳에 나 위치시킬 수 있도록 하자고 말을 했었는데 여러 가지 시행착오 끝에 결론적으로 저희의 의도대로 완성할 수 있어서 기분 좋게 마무리할 수 있었던 것 같습니다. 또한 좌표판별 알고리즘을 짜면서 그래프를 그려가면서 좌표를 그렸던 과정도 기억에 많이 남는 것 같습니다.<p>

<b>[얼음 크기 최대일 때 예시]</b>

y = 0.48x - 288 <= 0 (600 <= x <= 1200 && 0 <= y < 290)

y = -0.48x + 825 <= 0 (600 <= x <= 1200 && 290 <= y <= 580)

y = -0.48x + 288 >= 0 (0 <= x < 600 && 0 <= y < 290)

y = 0.48x + 260 >= 0 (0 <= x < 600 && 290 <= y <= 580)</p>
<i>👉 위 네 개의 조건 만족 시 Drag & Drop 가능한 좌표</i>

</details>

<details><summary><b>Drag and Drop(DnD)을 이용한 아이템 이동</b>
</summary>
<b>DnD 구현기</b><p>
Drag and Drop을 위한 라이브러리가 존재했지만 어려운 기능이 필요한 것이 아니었기 때문에 직접 구현해 보는 방향으로 진행하였습니다. 구현중 가장 어려움이 많았던 부분은 아이템 drag 영역 설정과 마우스의 절대 좌표를 구해 해당 좌표에 위치시키는 부분이었다고 생각합니다. DnD 구현 초반에는 얼음판 전체 이미지 위에 작은 픽셀로 쪼갠 array를 매핑해 준 뒤, 마우스 drop시 찾아지는 엘리먼트에 아이템 이미지를 appendChild 해주는 방식을 사용하려 했습니다. 그러나 한 화면에 200개 이상의 div를 랜더 시키는 것은 비효율적이고 앱 성능에도 좋지 않을 것 같다는 팀원들의 의견이 있었고 아이템 drag시에 셀 수 없이 많은 이벤트 요청이 일어나는 이슈가 있어 하나의 큰 div에서 drag를 컨트롤하는 구현 방법으로 변경하게 되었습니다.
Drag and Drop Api의 DataTransfer를 이번 프로젝트를 하면서 처음 접해보았는데 컴포넌트 간 드래그 되는 대상의 정보를 쉽게 전달받을 수 있다는 점이 상당히 용이했기에 기억에 남는 것 같습니다.</p>
<b>드래그 이미지 설정 이슈</b><br>
애니메이션 효과와 더불어 이미지 렌더링 최적화를 위해 스프라이트 이미지를 사용하였는데 스프라이트 이미지를 사용하는 요소를 드래그하는 과정에서 스프라이트 이미지 전체가 노출되는 이슈가 있습니다. DataTransfer의 setDragImage를 사용하여 지정해준 이미지를 사용자에게 보여주려고 했지만, 완벽히 적용되지 않고 원본이 노출되는 현상을 해결하지 못해 아쉬움이 남습니다.
</details>

<details><summary><b>Axios Interceptor를 사용한 보안 검증</b>
</summary>
<b>AccessToken 재발급 처리</b><br>
AccessToken이 만료된 상태로 Gmail 서버로 요청을 보냈을 경우(401 Unauthorized) axios의 Interceptor를 통해 요청 중간에 AccessToken을 재발급 해준 뒤 서버에 재 요청을 보내는 방식을 사용하였습니다. AccessToken을 사용하는 모든 요청에서 각각 토큰 만료에 반응하는 반복되는 코드를 작성하지 않아도 되었고 헤더 및 baseUrl과 같이 동일하게 사용되는 부분을 공통으로 처리해 주어 관리하기 수월했다고 생각합니다.
처음 작성 시에는 React 컴포넌트가 아닌 일반 JavaScript util 함수 안에서 Axios Interceptor를 작성해 사용하려 했었습니다. 하지만 Interceptor 내부에서 AccessToken을 재발급 해줌과 동시에 Redux 전역 상태 업데이트를 해줘야 했기 때문에 ‘Hooks는 함수 컴포넌트의 본문 내에서만 호출할 수 있습니다’라는 React Hooks 규칙 위반 오류 메시지를 접하게 되었습니다. 그렇기 때문에 Custom Hook으로 변경해 작성해 사용해 주었습니다.
</details>

<details><summary><b>Socket.IO와 사용자  실시간 인터랙션</b>
</summary>
소셜 웹 애플리케이션이기 때문에 생각보다 신경 써서 구현해야 할 유저 인터랙션이 많이 있었는데 예를 들어
친구 신청이나 선물을 보냈을 때 두 명의 유저 모두 접속하고 있는 경우와 혹은 상대방은 접속해 있지 않을 때가 있습니다. 저희는 조금 더 사용자 친화적으로 웹 서비스를 완성시키고 싶었기에 두 상황 각각 다르게  대응하도록 하였습니다. 상대방이 현재 접속해 있을 때는 실시간으로 알림 모달을 보내서 친구가 왔거나 선물이 온 상황에 바로 답을 할 수 있도록 하였습니다. 친구 신청 버튼을 누르는 순간 Socket으로 이벤트를 보내고 누구에게 보내는 신청인지 확인하고 해당하는 유저에게 알림을 보냈습니다. 두 번째 상황으로 상대방은 접속해 있지 않을 때입니다. 이런 경우에는 실시간으로 알림 창을 띄워줄 수는 없었기에 유저가 로그인했을 때 확인하지 않은 새로운 알림이 있으면 작은 팝업으로 알림을 표시하기로 하였습니다. 하지만 초기 기획 때 이 부분을 미처 생각하지 못하고 진행했기 때문에 데이터베이스를 변경해야 하는 일이 생겼습니다. 따라서 isChecked라는 항목을 추가해서 유저가 확인한 알림인지 Boolean 값으로 판별할 수 있도록 하였습니다.
이때가 Model를 수정하는 일이 처음은 아니었기에 더욱더 이번 프로젝트를 하면서 초기 설계의 중요성을 다시 한번 깨닫는 계기가 되었고 사용자 입장에서 웹 서비스를 제작하는 것이 중요하다고 생각이 들었습니다.
</details>

## 💡 회고

**`조은별`**<br>

<details><summary>
</summary>

_Write here!_

</details>

**`최리`**<br>

<details><summary>
</summary>

_Write here!_

</details>

**`한지원`**

<details><summary><b>#배움또배움</b>
</summary>
팀 프로젝트를 진행하면서 협업 측면에서도 기술적 측면에서도 배울 점이 많았던 기간이었던 것 같습니다.

팀 커뮤니케이션
3주 안에 기획부터 개발, 배포까지 마치는 일정으로 진행된 프로젝트로 작업 시간을 최대로 가져갈 수 있도록 팀원들과 다음과 같은 시도를 하였습니다.

1. 슬랙을 통한 데일리 스크럼 미팅 : 개발 기간동안 매일 슬랙을 통한 스크럼 미팅을 진행, 팀원 모두의 작업 현황을 공유하고 일정에 이상이 있는지, 도움이 필요한 작업이 있는지의 여부를 체크하며 일정관리를 할 수 있었습니다. 때로는 일정보다 늦어지는 작업이 발생하기도 했지만, 매일 팀원들과 소통하면서 테스크를 조정해 나갔기 때문에 일정 안에 프로젝트를 마칠 수 있었다고 생각합니다.
2. PR 템플릿 적용으로 원활한 코드리뷰 도모 : 프로젝트 초기에는 PR 템플릿이 적용되어 있지 않아 팀원별로 각자 다른 스타일로 요청을 올렸는데, 코드리뷰를 하다가 궁금한 부분이나, 이해가 어려운 부분이 있는 경우 다시한번 해당 팀원에게 질문을 하거나 확인하는 과정이 불편할 수 있다고 생각하고 있었습니다. 그 때 PR 문서화에 대한 조언을 접할 수 있었고 관련 칸반 카드, 테스트 방안, 기타 코드 관련 내용 등을 PR 내용에 추가하면 보다 많은 정보를 가지고 코드리뷰를 할 수 있어 보다 효율적인 작업이 가능한 것을 배우게 되었습니다.

컴포넌트의 구조와 재사용성
프로젝트 목업 작업에서 따로 재사용할 컴포넌트를 지정하지 않았기 때문에 비슷한 구성의 컴포넌트들을 여러 개 만들게 되었습니다. 컴포넌트가 상당히 세분되어 있어 모달창을 띄우는 상태 값을 전역으로 저장하지 않았던 시기에는 props drilling의 깊이가 깊어지는 이슈가 발생하여 프로젝트 후반에 전역 관리로 변경하는 리팩토링 작업을 진행하게 되었습니다. 이 과정에서 단순한 구조이면서도 재사용성이 높은 컴포넌트에 대한 중요성을 알게 되었습니다. 이번 프로젝트에서의 경험으로 다음부터는 프로젝트 기획 시 컴포넌트의 구조와 재사용성에 대한 고민이 필요하다는 것을 배우게 되었습니다.

라이브러리 의존성
프로젝트 초반 gapi를 손쉽게 사용할 수 있는 로그인 라이브러리나, UI 구성에 유용한 컴포넌트를 제공해주는 라이브러리 등을 프로젝트에 적용한 부분이 있는데, 라이브러리 의존성이 높은 경우 유지보수가 어려워질 수 있다고 생각하여, 프로젝트 중반 라이브러리 없이 구현할 수 있는 방법이 있는지 새롭게 공부하며 라이브러리를 대체해 나가는 작업 과정이 있었습니다. 관련된 여러 라이브러리를 살펴보고 분석하는 과정에서 기술적인 지식을 많이 얻을 수 있었고 스스로 구현하려 노력하는 자세가 성취도와 자신감에 많은 영향을 끼칠 수 있다는 것도 알게 되었습니다. 이번 경험을 바탕으로 앞으로도 새로운 것을 배우고 직접 써보는 것에 적극적인 자세로 임하고 싶습니다.

</details>

## 🙇‍♀️ 팀원

**`조은별`** choyeun98@naver.com / https://github.com/choyeun98<br>
**`최 리`** chlfl2121@gmail.com / https://github.com/choiree<br>
**`한지원`** nomad.jiwhan@gmail.com / https://github.com/geeonie

