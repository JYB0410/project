# 펫함께 가이드

반려동물과 함께하는 일상을 차분하게 정리하는 **브랜드형 정보 사이트**입니다.  
정적 HTML/CSS/JS 기반이며, `/admin` 경로에 **운영자 콘텐츠 관리 화면**이 포함되어 있습니다.

> **운영 방식:** `node server.js` 실행 시 서버 세션·HttpOnly 쿠키 기반 로그인이 적용됩니다. 편집 데이터는 브라우저 localStorage에 저장되며, 영구 반영은 JSON보내기 후 data 파일 수정이 필요합니다.

## 빠른 실행 (Replit / 로컬)

```bash
node server.js
```

또는 Windows에서 `start.bat` 더블클릭.

`npm start`도 동일하게 `node server.js`를 실행합니다. PowerShell에서 npm 실행 정책 오류가 나면 `node server.js`를 직접 사용하세요.

브라우저에서 `http://localhost:5000` 을 엽니다.

Python이 있다면:

```bash
python -m http.server 5000
```

## 프로젝트 구조

```
pet-hamkke-guide/
├── index.html              # 홈
├── about/                  # 사이트 소개
├── author/                 # 운영자·칼럼 허브
├── contact/                # 문의
├── categories/             # 카테고리
├── posts/                  # 글 상세 (17편)
├── columns/                # 칼럼 (4편)
├── admin/                  # CMS-lite 관리자
├── privacy/ terms/ disclaimer/ sitemap/
├── 404.html robots.txt sitemap.xml
├── data/
│   ├── site.config.js      # 사이트 설정
│   ├── categories.js       # 카테고리
│   ├── posts.js            # 일반 글 데이터
│   └── columns.js          # 칼럼 데이터
└── assets/css js icons/
```

## 운영자 → 칼럼 작성 흐름

1. 푸터·편집자 박스의 **정지석** 클릭 → `/author/`
2. 일반 방문자: 운영자 소개 + 칼럼 목록
3. 관리자 로그인 상태(`sessionStorage`): **새 칼럼 작성하기** 버튼 표시
4. 버튼 클릭 → `/admin/#columns-new`

## 관리자 로그인 (최초 1회 설정)

```bash
node scripts/setup-admin.js
```

8자 이상 비밀번호를 입력하면 `admin.secrets.json`이 생성됩니다. **이 파일은 Git에 올리지 마세요** (.gitignore 포함).

- URL: `http://localhost:5000/admin/`
- 반드시 `node server.js`로 실행 (python 정적 서버에서는 인증 API 미동작)
- 로그인 5회 실패 시 15분 잠금
- 세션 유효: 2시간

비밀번호 변경: `admin.secrets.json` 삭제 후 `setup-admin.js` 재실행

환경변수 대안: `ADMIN_PASSWORD=비밀번호 node server.js` (임시 운영용)

## 콘텐츠 수정 방법

### 1) 데이터 파일 직접 수정 (권장·영구 반영)

| 항목 | 파일 |
|------|------|
| 사이트명·색상·이메일·운영자 | `data/site.config.js` |
| 카테고리 | `data/categories.js` |
| 일반 글 | `data/posts.js` |
| 칼럼 | `data/columns.js` |

글/칼럼 HTML(`posts/*.html`, `columns/*.html`)은 슬러그별 껍데기이며, 본문은 data 파일에서 로드됩니다.

### 2) 관리자 UI (브라우저 저장)

- 글·칼럼·설정 편집 후 저장 → `localStorage`
- **JSON보내기**로 백업 → `data/*.js`에 수동 반영 가능
- 기기·브라우저 변경 시 localStorage 데이터는 유지되지 않을 수 있음

## SEO

- 페이지별 title / description / canonical (JS 동적 설정)
- Article / Breadcrumb / FAQ JSON-LD (글 상세)
- `robots.txt`, `sitemap.xml`, HTML 사이트맵

## 연락

- 이메일만 사용: `onhopetoj@gmail.com` (`data/site.config.js`)
- 전화·주소는 사이트에 포함하지 않음

## GitHub에서 운영하기

이 프로젝트는 **백엔드 없는 정적 사이트**라 GitHub Pages에 바로 올릴 수 있습니다. `server.js`는 로컬 미리보기용이며, GitHub Pages에서는 필요 없습니다.

### 1) GitHub 저장소 만들기

```bash
cd pet-hamkke-guide
git init
git add .
git commit -m "Initial commit: 펫함께 가이드"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

### 2) GitHub Pages 켜기

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 배포합니다.

배포 주소 예시: `https://사용자명.github.io/저장소명/`

### 3) 배포 후 수정할 것

`data/site.config.js`의 `siteUrl`을 실제 Pages 주소로 바꾸세요.

```js
siteUrl: "https://사용자명.github.io/저장소명"
```

커스텀 도메인을 쓰면 GitHub Pages 설정에서 도메인을 연결하고, 같은 파일의 `siteUrl`도 맞춰 주세요.

### 참고

| 항목 | GitHub Pages |
|------|----------------|
| 일반 페이지·글·칼럼 | ✅ 정상 |
| SEO / sitemap | ✅ (siteUrl만 실제 주소로 변경) |
| `/admin` CMS-lite | ✅ 브라우저 localStorage 기반 (기기별 저장) |
| `server.js` | ❌ Pages에서는 미사용 (정적 파일만 서빙) |

## 확장 여지

- Supabase / Firebase / Git-based CMS로 `DataStore` 레이어만 교체 가능
- 정적 생성 스크립트로 SEO용 HTML 사전 렌더링 추가 가능

---

운영자: 정지석 | 주제: 함께 살아가는 반려동물 실용 가이드