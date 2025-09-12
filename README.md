# Coubee (쿠비) - 사장님을 위한 매장 관리 솔루션

![Coubee Logo](public/coubee.svg)

Coubee는 바쁜 사장님들을 위해 탄생한 직관적이고 강력한 웹 기반 매장 관리 솔루션입니다. 실시간 주문 처리부터 매출 분석, 상품 관리에 이르기까지, 매장 운영에 필요한 모든 기능을 하나의 대시보드에서 간편하게 관리할 수 있도록 돕습니다.

<br/>

## ✨ 주요 기능

- **🏠 실시간 주문 대시보드**: 들어온 주문을 실시간으로 확인하고, 접수, 처리, 완료까지 한눈에 관리합니다.
- **📦 간편한 상품 관리**: 몇 번의 클릭만으로 새로운 상품을 등록하고, 정보를 수정하며, '핫딜' 상품을 설정할 수 있습니다.
- **📈 스마트 매출 분석**: 일별, 주별, 월별 매출 데이터를 시각적인 차트로 확인하여 매장의 성과를 직관적으로 파악할 수 있습니다.
- **🗺️ 매장 위치 설정**: Kakao Maps API와 주소 검색을 연동하여 고객에게 보여질 매장의 위치를 정확하게 등록할 수 있습니다.
- **📲 실시간 알림**: SSE (Server-Sent Events) 기술을 활용하여 새로운 주문이 들어오면 즉시 알려주어 중요한 주문을 놓치지 않도록 합니다.
- **🎨 커스텀 컴포넌트**: 재사용 가능한 버튼, 카드, 입력창 등 커스텀 UI 컴포넌트를 구축하여 일관된 사용자 경험을 제공합니다.

<br/>

## 🛠️ 기술 스택

이 프로젝트는 현대적인 웹 기술들을 적극적으로 활용하여 빠르고 안정적인 사용자 경험을 제공하는 데 중점을 두었습니다.

| 구분                 | 기술                   |
| -------------------- | ---------------------- |
| **Core**             | `React 19`, `Vite`     |
| **State Management** | `Redux Toolkit`        |
| **Routing**          | `React Router`         |
| **Styling**          | `Styled Components`    |
| **Data Fetching**    | `Axios, RTK Query`     |
| **Real-time**        | `EventSource (SSE)`    |
| **Charts**           | `Recharts`             |
| **Maps**             | `React Kakao Maps SDK` |
| **Code Quality**     | `ESLint`               |

<br/>

## 📁 프로젝트 구조

프로젝트는 기능별 모듈화와 재사용성에 초점을 맞춰 다음과 같이 구성되어 있습니다.

```
/Users/jin/Documents/coubee-fe-web/
├───.gitignore
├───eslint.config.js
├───index.html
├───package.json
├───README.md
├───vite.config.js
├───public/
│   ├───coubee.svg
│   └───vite.svg
└───src/
    ├───App.css
    ├───App.jsx
    ├───index.css
    ├───main.jsx
    ├───api/
    │   ├───imgApi.js
    │   ├───index.js
    │   └───mapApi.js
    ├───assets/
    │   ├───coubee-landing-video.mp4
    │   ├───coubee.svg
    │   ├───coubeeCreated.svg
    │   ├───coubeeLogin.svg
    │   ├───coubeeRegi.svg
    │   ├───coubeeWelcome.svg
    │   └───react.svg
    ├───components/
    │   ├───cropImage.js # 이미지 크로핑 용
    │   ├───Header.jsx
    │   ├───ImageUploader.jsx # 이미지 업로드 (자체적으루 함수 들어가있음)
    │   ├───KakaoMap.jsx
    │   ├───NotificationModal.jsx # 공용 알림 모달
    │   ├───SseClient.jsx # sse client connection 용
    │   ├───SseClient2.jsx
    │   ├───useKakaoLoader.js
    │   └───common/
    │       ├───Button.jsx
    │       ├───Card.jsx
    │       ├───Input.jsx
    │       ├───OrderStatusChip.jsx
    │       ├───Text.jsx
    │       └───TextArea.jsx
    ├───hooks/
    │   └───useCreateStoreForm.js # 상점 등록하는 hook
    ├───pages/
    │   ├───CreateStorePage/ # 상점 등록 프로세스 있는 페이지
    │   │   ├───CreateStorePage.jsx
    │   │   └───components/
    │   │       ├───FirstStep.jsx
    │   │       ├───PreviewComponent.jsx
    │   │       ├───ProgressBar.jsx
    │   │       ├───SecondStep.jsx
    │   │       ├───SuccessComponent.jsx
    │   │       └───ThirdStep.jsx
    │   ├───LandingPage/ # 랜딩 페이지
    │   │   ├───LandingPage.jsx
    │   │   └───components/
    │   │       ├───CtaSection.jsx
    │   │       ├───FeaturesSection.jsx
    │   │       └───HeroSection.jsx
    │   ├───LoginPage/ # 로그인 페이지
    │   │   └───LoginPage.jsx
    │   ├───MyStorePage/ # 내 등록된 상점 페이지
    │   │   ├───MyStorePage.jsx
    │   │   ├───components/
    │   │   │   └───StoreCard.jsx
    │   │   └───StoreCreationModal/
    │   │       └───StoreCreationModal.jsx
    │   ├───OrderDetailPage/ # 주문이 들어온 내역을 상세 보여주는 페이지
    │   │   ├───OrderDetailPage.jsx
    │   │   └───component/
    │   │       ├───ActionButtons.jsx
    │   │       ├───OrderCancelModal.jsx
    │   │       ├───OrderDetailSkeleton.jsx
    │   │       ├───ProcessTracker.jsx
    │   │       └───QRScanModal.jsx
    │   ├───RegistrationPage/ # 회원 가입 페이지
    │   │   └───RegistrationPage.jsx
    │   └───ViewStore/ # 상점 상세보기 페이지
    │       ├───ViewStorePage.jsx
    │       └───components/
    │           ├───EmptyItem.jsx
    │           ├───HotdealCard.jsx
    │           ├───HotdealEditModal.jsx
    │           ├───InformationEditModal.jsx
    │           ├───InformationSection.jsx
    │           ├───ItemCard.jsx
    │           ├───ItemForm.jsx
    │           ├───ItemModal.jsx
    │           ├───ItemSection.jsx
    │           ├───ItemSkeleton.jsx
    │           ├───QRDoubleCheckModal.jsx
    │           ├───StoreSkeleton.jsx
    │           ├───Chart/
    │           │   ├───ChartSection.jsx
    │           │   ├───ChartSkeleton.jsx
    │           │   ├───DailySalesChart.jsx
    │           │   ├───MonthlySalesChart.jsx
    │           │   ├───ProductSalesSummary.jsx
    │           │   └───WeeklySalesChart.jsx
    │           └───Order/
    │               ├───OrderCard.jsx
    │               ├───OrderSection.jsx
    │               └───OrderSkeleton.jsx
    ├───redux/
    │   ├───store.js
    │   ├───api/
    │   │   ├───hotdealApi.js # RTK Query 핫딜
    │   │   ├───orderApi.js # RTK Query 주문내역 관리
    │   │   ├───productApi.js # RTK Query 상품 목록
    │   │   └───salesApi.js # RTK Query 차트용
    │   └───slices/
    │       ├───myStoreSlice.js
    │       ├───productSlice.js
    │       ├───storeSlice.js
    │       ├───userSlice.js
    │       └───viewStoreSlice.js
    ├───styles/
    │   ├───theme.js
    │   └───toast-theme.css
    └───utils/
        ├───keyboardMap.js
        ├───statusHelper.js
        └───validation.js
```

<br/>

## 🚀 시작하기

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

1.  **저장소 복제**

    ```bash
    git clone https://github.com/your-repository/coubee-fe-web.git
    cd coubee-fe-web
    ```

2.  **의존성 설치**

    ```bash
    npm install
    ```

3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 Vite가 지정한 다른 포트)으로 접속하세요.

<br/>

## 📜 사용 가능한 스크립트

- `npm run dev`: 개발 모드로 Vite 서버를 실행합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint를 사용하여 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드 결과물을 로컬에서 미리 봅니다.
