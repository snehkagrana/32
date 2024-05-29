/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import './App.css'
// import Home from './routes/Home'
import EnterEmail from './routes/EnterEmail'
import AddQuestions from './routes/AddQuestions'
import AddChapters from './routes/AddChapters'
import AddInformation from './routes/AddInformation'
import SkillPage from './routes/SkillPage'
import AboutUs from './routes/AboutUs'
import ContactUs from './routes/ContactUs'
import SkillCategoryPage from './routes/SkillCategoryPage'
import InformationPage from './routes/InformationPage'
import NotFound from './routes/NotFound'
import Login from './routes/Login'
import Register from './routes/Register'
import Quiz from './routes/Quiz'
import ScorePage from './routes/ScorePage'
import AccessDenied from './routes/AccessDenied'
import ProfilePage from './routes/ProfilePage'
import AllSkills from './routes/AllSkills'
import AllCategories from './routes/AllCategories'
import AllSubCategories from './routes/AllSubCategories'
import AllInformation from './routes/AllInformation'
import AllQuestions from './routes/AllQuestions'
import EditQuestion from './routes/EditQuestion'
import EditInformation from './routes/EditInformation'
import EditSubCategory from './routes/EditSubCategory'
import EditCategory from './routes/EditCategory'
import EditSkill from './routes/EditSkill'
import ForgotPassword from './routes/ForgotPassword'
import ForgotPasswordMailSent from './routes/ForgotPasswordMailSent'
import Terms from './routes/Terms'
import PrivacyPolicy from './routes/PrivacyPolicy'
import 'src/styles/FingoGlobal.styles.css'
import NewProfilePage from './routes/NewProfilePage'
import DailyQuestPage from './routes/DailyQuestPage'
import HomePage from './pages/HomePage'
import AdminRewardPage from './pages/admin/AdminRewardPage'
import { Toaster, ToastBar } from 'react-hot-toast'
import AuthCallback from './pages/AuthCallback'
import LandingPage from './pages/LandingPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { useAuth, usePersistedGuest } from './hooks'
import { useDispatch } from 'react-redux'
import InvitationPage from './pages/InvitationPage'
import { authUtils } from './utils'

/**
 * Pages
 */
const TestDNDPage2 = React.lazy(() => import('./pages/admin/TestDNDPage2'))
const AdminNotificationPage = React.lazy(
    () => import('./pages/admin/AdminNotificationPage')
)
const AdminNotificationTemplatePage = React.lazy(
    () => import('./pages/admin/AdminNotificationTemplatePage')
)
const AdminNotificationHistoryPage = React.lazy(
    () => import('./pages/admin/AdminNotificationHistoryPage')
)

const App = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const { persistedGuest_reset, guest, auth_initGuest } = usePersistedGuest()

    const initGuest = useCallback(() => {
        if (!guest._id && !guest?.registerToken) {
            dispatch(auth_initGuest())
        }
    }, [guest])

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(persistedGuest_reset())
            authUtils.removeGuestAccessToken()
        } else {
            if (!guest._id) {
                initGuest()
            }
        }
    }, [isAuthenticated, user])

    return (
        <>
            <Suspense fallback={<p>Loading...</p>}>
                <Router>
                    <Routes>
                        <Route exact path='/' element={<LandingPage />} />
                        <Route exact path='/terms' element={<Terms />} />
                        <Route
                            exact
                            path='/auth/google/callback'
                            element={<AuthCallback />}
                        />
                        <Route
                            exact
                            path='/invite/:referralCode'
                            element={<InvitationPage />}
                        />
                        <Route
                            exact
                            path='/privacypolicy'
                            element={<PrivacyPolicy />}
                        />
                        <Route
                            exact
                            path='/profile'
                            element={<NewProfilePage />}
                        />
                        <Route
                            exact
                            path='/daily-quest'
                            element={<DailyQuestPage />}
                        />
                        <Route exact path='/home' element={<HomePage />} />
                        <Route exact path='/auth/login' element={<Login />} />
                        <Route
                            exact
                            path='/auth/register'
                            element={<Register />}
                        />
                        <Route
                            exact
                            path='/skills/:skillName'
                            element={<SkillPage />}
                        />
                        <Route
                            exact
                            path='/skills/:skillName/:categoryName'
                            element={<SkillCategoryPage />}
                        />
                        <Route
                            exact
                            path='/updateemail'
                            element={<EnterEmail />}
                        />
                        <Route
                            exact
                            path='/skills/:skillName/:category/:subcategory/information/:page'
                            element={<InformationPage />}
                        />
                        <Route
                            exact
                            path='/addquestions'
                            element={<AddQuestions />}
                        />
                        <Route
                            exact
                            path='/addinformation'
                            element={<AddInformation />}
                        />
                        <Route
                            exact
                            path='/addchapters'
                            element={<AddChapters />}
                        />
                        <Route
                            exact
                            path='/skills/:skillName/:category/:subcategory/quiz'
                            element={<Quiz />}
                        />
                        <Route
                            exact
                            path='/skills/:skillName/:category/:subcategory/score'
                            element={<ScorePage />}
                        />
                        <Route
                            exact
                            path='/accessdenied'
                            element={<AccessDenied />}
                        />
                        <Route
                            exact
                            path='/profilepage'
                            element={<ProfilePage />}
                        />
                        <Route
                            exact
                            path='/allskills'
                            element={<AllSkills />}
                        />
                        <Route
                            exact
                            path='/allcategories/:skill'
                            element={<AllCategories />}
                        />
                        <Route
                            exact
                            path='/allsubcategories/:skill/:category'
                            element={<AllSubCategories />}
                        />
                        <Route
                            exact
                            path='/allinformation/:skill/:category/:subcategory'
                            element={<AllInformation />}
                        />
                        <Route
                            exact
                            path='/allquestions/:skill/:category/:subcategory'
                            element={<AllQuestions />}
                        />
                        <Route
                            exact
                            path='/editquestion/:skill/:category/:subcategory/:id'
                            element={<EditQuestion />}
                        />
                        <Route
                            exact
                            path='/editinformation/:skill/:category/:subcategory/:id'
                            element={<EditInformation />}
                        />
                        <Route
                            exact
                            path='/editsubcategory/:skill/:category/:subcategory'
                            element={<EditSubCategory />}
                        />
                        <Route
                            exact
                            path='/editcategory/:skill/:category'
                            element={<EditCategory />}
                        />
                        <Route
                            exact
                            path='/editskill/:skill'
                            element={<EditSkill />}
                        />
                        <Route
                            exact
                            path='/forgotpassword/:email/:token'
                            element={<ForgotPassword />}
                        />
                        <Route
                            exact
                            path='/forgotpasswordmailsent'
                            element={<ForgotPasswordMailSent />}
                        />
                        <Route
                            exact
                            path='/contactus'
                            element={<ContactUs />}
                        />
                        <Route exact path='/aboutus' element={<AboutUs />} />

                        {/* auth routes */}
                        <Route
                            exact
                            path='/reset-password/:email/:token'
                            element={<ResetPasswordPage />}
                        />

                        {/* ----- admin routes ----- */}
                        <Route
                            exact
                            path='/admin/notification/template'
                            element={<AdminNotificationTemplatePage />}
                        />
                        <Route
                            exact
                            path='/admin/notification/delivered-notification'
                            element={<AdminNotificationHistoryPage />}
                        />
                        <Route
                            exact
                            path='/admin/notification'
                            element={<AdminNotificationPage />}
                        />
                        <Route
                            exact
                            path='/admin/test-dnd'
                            element={<TestDNDPage2 />}
                        />
                        <Route
                            exact
                            path='/admin/reward'
                            element={<AdminRewardPage />}
                        />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Router>
            </Suspense>
            <Toaster position='bottom-center' reverseOrder={false}>
                {t => (
                    <ToastBar
                        toast={t}
                        style={{
                            ...t.style,
                        }}
                    />
                )}
            </Toaster>
        </>
    )
}

export default App

/**
 * UseEffect Cleanup
 * Error Handling
 */
