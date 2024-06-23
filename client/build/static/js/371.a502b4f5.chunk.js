"use strict";(self.webpackChunkquiz=self.webpackChunkquiz||[]).push([[371],{9198:function(e,n,i){var t,r,s,l,o,a,d=i(168),c=i(2791),u=i(61),m=i(9346),x=i(184),h=u.ZP.div(t||(t=(0,d.Z)(["\n    display: flex;\n    align-items: center;\n    height: 72px;\n    width: 100%;\n    border: 1px solid rgb(109 109 109 / 10%);\n    border-radius: 0.4rem;\n    margin-bottom: 0.5rem;\n    padding: 0.2rem 0.6rem;\n    cursor: pointer;\n"]))),f=u.ZP.div(r||(r=(0,d.Z)(["\n    margin-left: 0.8rem;\n"]))),p=u.ZP.h4(s||(s=(0,d.Z)(["\n    font-size: 1rem;\n    font-weight: 700;\n    margin-bottom: 0.25rem;\n    margin-right: 1rem;\n"]))),v=u.ZP.p(l||(l=(0,d.Z)(["\n    font-size: 0.8rem;\n    margin-bottom: 0;\n"]))),g=u.ZP.img(o||(o=(0,d.Z)(["\n    width: 45px;\n    height: 45px;\n    border-radius: 45px;\n"]))),j=u.ZP.button(a||(a=(0,d.Z)(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-left: auto;\n    height: 26px;\n    width: 26px;\n    background-color: transparent;\n    border: 1px solid #ececec;\n    border-radius: 26px;\n    padding: 0;\n    svg {\n        font-size: 26px;\n        color: #00d323;\n    }\n"])));n.Z=function(e){var n=e.data,i=e.checked,t=e.onCheck,r=e.canChecked,s=(0,c.useCallback)((function(){r&&t(n)}),[n,t,r]);return(0,x.jsxs)(h,{onClick:s,children:[(0,x.jsx)(g,{src:(null===n||void 0===n?void 0:n.imgPath)||m}),(0,x.jsxs)(f,{children:[(0,x.jsx)(p,{children:n.displayName}),(0,x.jsx)(v,{children:n.email})]}),r&&(0,x.jsx)(j,{onClick:s,children:i?(0,x.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 24 24",children:(0,x.jsx)("path",{fill:"currentColor",d:"M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-.997-6l7.07-7.071l-1.413-1.414l-5.657 5.657l-2.829-2.829l-1.414 1.414z"})}):(0,x.jsx)("div",{})})]})}},371:function(e,n,i){i.r(n),i.d(n,{default:function(){return le}});var t,r,s,l,o,a,d,c,u,m,x=i(168),h=i(4165),f=i(5861),p=i(2791),v=i(7689),g=i(7022),j=i(9743),Z=i(2677),b=i(4270),N=i(9582),y=i(8815),k=i(2351),C=(i(7261),i(5305)),w=i(4420),I=i(7709),S=i(1413),P=i(9439),_=i(5630),R=i(3360),B=i(1241),F=i(1134),q=i(4695),M=i(8007),U=(i(561),i(1830)),z=i.n(U),A=i(9681),O=i(8520),T=(i(7992),i(6632)),E=(i(5218),i(8414)),L=i(61),V=i(9198),G=i(184),D=L.ZP.div(t||(t=(0,x.Z)(["\n    overflow-y: scroll;\n    max-height: 100vh;\n"]))),W=L.ZP.div(r||(r=(0,x.Z)(["\n    border-radius: 0.4rem;\n    padding: 1rem;\n"]))),Q=L.ZP.div(s||(s=(0,x.Z)([""]))),X=L.ZP.div(l||(l=(0,x.Z)(["\n    font-size: 1.1rem;\n    font-weight: bold;\n    text-align: center;\n    margin-bottom: 1rem;\n"]))),H=function(e){var n=e.defaultValues,i=e.onSubmit,t=(0,w.I0)(),r=(0,k.zn)(),s=r.notifications_setOpenModalUserRecipients,l=r.openModalUserRecipients,o=r.notificationRecipientsData,a=(0,p.useState)(""),d=(0,P.Z)(a,2),c=d[0],u=d[1],m=(0,p.useState)(!1),x=(0,P.Z)(m,2),h=x[0],f=x[1],v=(0,p.useState)([]),g=(0,P.Z)(v,2),b=g[0],N=g[1],y=(0,p.useCallback)((function(e){var n=Array.from(b);if(null===b||void 0===b?void 0:b.find((function(n){return n._id===(null===e||void 0===e?void 0:e._id)}))){var i=Array.from(b).filter((function(n){return n._id!==e._id}));N(i)}else N([].concat(n,[e]))}),[b]),C=(0,p.useMemo)((function(){if((null===o||void 0===o?void 0:o.length)>0)return(null===c||void 0===c?void 0:c.length)>0?o.filter((function(e){var n,i;return null===(n=e.displayName)||void 0===n||null===(i=n.toLowerCase())||void 0===i?void 0:i.includes(null===c||void 0===c?void 0:c.toLowerCase())})):o}),[c,o]),I=(0,p.useMemo)((function(){return(null===b||void 0===b?void 0:b.length)===o.length}),[b,o]),S=(0,p.useCallback)((function(){t(s(!1)),i(b)}),[b,h,l]),_=(0,p.useCallback)((function(e){u(e.target.value)}),[c]),F=(0,p.useCallback)((function(){i(b),S()}),[b,l]);(0,p.useEffect)((function(){(null===n||void 0===n?void 0:n.length)>0&&(N(n),f(!1))}),[n,h]);var q=(0,p.useCallback)((function(){N(I?[]:o)}),[I]);return(0,G.jsx)(B.SI,{open:l,onClose:S,width:400,children:(0,G.jsx)(D,{children:(0,G.jsxs)(W,{children:[(0,G.jsx)(X,{children:"Select notification recipients"}),(0,G.jsx)(Q,{children:(0,G.jsx)(B.O1,{name:"searchValue",value:c,placeholder:"Search user",onChange:_,style:{marginBottom:"1rem"}})}),(0,G.jsxs)(j.Z,{className:"justify-content-center",children:[(0,G.jsx)(Z.Z,{xs:12,className:"px-2 text-center mb-2",children:(null===C||void 0===C?void 0:C.length)>0&&(0,G.jsx)(R.Z,{size:"sm",onClick:q,children:I?"Unselect All":"Select All"})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:Array.isArray(C)&&C.length>0?(0,G.jsx)(p.Fragment,{children:C.map((function(e,n){return(0,G.jsx)(V.Z,{data:e,checked:b.find((function(n){return n._id===e._id})),onCheck:y,canChecked:!0},String(n))}))}):(0,G.jsx)("div",{className:"text-center py-4",children:(0,G.jsx)("p",{children:"Users not found"})})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2 py-2 text-center",children:(0,G.jsx)(B.mW,{style:{width:120},onClick:F,children:"DONE"})})]})]})})})},J=M.Ry().shape({title:M.Z_().required("Field required"),body:M.Z_().required("Field required"),users:M.IX(M.Ry().shape({userId:M.Z_().required("Field required"),displayName:M.Z_().required("Field required"),email:M.Z_().required("Field required"),imgPath:M.Z_().nullable(!0)})).min(1)}),K={title:"",body:"",imageUrl:"",users:[]},Y=L.ZP.div(o||(o=(0,x.Z)(["\n    border-radius: 0.3rem;\n    border: 1px solid #ececec;\n    padding: 1.5rem 1rem;\n    margin-bottom: 1.2rem;\n"]))),$=L.ZP.div(a||(a=(0,x.Z)(["\n    position: relative;\n    .TrashBtn {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        height: 26px;\n        width: 26px;\n        border-radius: 26px;\n        padding: 0;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n"]))),ee=L.ZP.div(d||(d=(0,x.Z)(["\n    display: flex;\n    align-self: center;\n    justify-content: center;\n    margin-top: 1rem;\n"]))),ne=L.ZP.div(c||(c=(0,x.Z)(["\n    border: 1px solid #00aeff;\n    background-color: #c6deff;\n    padding: 0.5rem;\n    border-radius: 0.4rem;\n    margin-bottom: 1rem;\n"]))),ie=L.ZP.div(u||(u=(0,x.Z)(["\n    border: 1px solid #da0000;\n    background-color: #ff5050;\n    padding: 0.5rem;\n    border-radius: 0.4rem;\n    margin-bottom: 1rem;\n"]))),te=function(e){var n,i,t=e.onSubmit,r=(0,w.I0)(),s=(0,k.w5)(),l=(s.modalForm,s.reward_setModalForm,s.reward_adminGetList,(0,p.useState)(!1)),o=(0,P.Z)(l,2),a=o[0],d=o[1],c=(0,p.useState)(null),u=(0,P.Z)(c,2),m=u[0],x=u[1],v=(0,p.useState)(null),g=(0,P.Z)(v,2),b=g[0],N=g[1],y=(0,k.zn)(),C=y.selectedUserRecipients,M=y.openModalUserRecipients,U=y.notifications_setOpenModalUserRecipients,z=(0,F.cI)({defaultValues:K,resolver:(0,q.X)(J)}),L=z.control,D=z.reset,W=z.handleSubmit,Q=z.setValue,X=z.getValues,te=(z.watch,z.formState.errors),re=(0,F.Dq)({control:L,name:"users"}),se=re.fields,le=(re.insert,re.update,re.remove),oe=function(){var e=(0,f.Z)((0,h.Z)().mark((function e(n){return(0,h.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t(n);case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),ae=(0,p.useCallback)(function(){var e=(0,f.Z)((0,h.Z)().mark((function e(n){var i;return(0,h.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return d(!0),e.prev=1,e.next=4,I.gv.upload(n);case 4:null!==(i=e.sent)&&void 0!==i&&i.data&&x(i.data),d(!1),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(1),x(null),console.log("e",e.t0),d(!1);case 14:case"end":return e.stop()}}),e,null,[[1,9]])})));return function(n){return e.apply(this,arguments)}}(),[m,b]);(0,p.useEffect)((function(){(null===C||void 0===C?void 0:C.length)>0?setTimeout((function(){Q("users",C.map((function(e){return{userId:e.userId,displayName:e.displayName,email:e.email}})))}),350):(D(K),x(null),N(null))}),[C]),(0,p.useEffect)((function(){(null===C||void 0===C?void 0:C.length)>0||(D(K),x(null),N(null))}),[C]);var de=(0,p.useCallback)((function(){r(U(!0))}),[M]),ce=(0,p.useCallback)((function(e){Q("users",e.map((function(e){return{userId:e._id,displayName:e.displayName||"-",email:e.email,imgPath:e.imgPath||null}})))}),[M]);return(0,G.jsxs)(p.Fragment,{children:[(0,G.jsx)(_.Z,{onSubmit:W(oe,(function(e){console.log("_errors",e)})),className:"px-2 FingoShapeRadius",children:(0,G.jsxs)(j.Z,{className:"justify-content-center",children:[(0,G.jsx)(Z.Z,{xs:9,className:"px-2 mb-2",style:{display:"none"},children:(0,G.jsxs)("div",{className:"ModalRewardUploadContainer",children:[(0,G.jsx)("label",{htmlFor:"uploadImage",children:(0,G.jsxs)("div",{className:"UploadImageMarker",children:[(0,G.jsx)(A.r,{}),(0,G.jsx)("p",{className:"mb-0",children:"Browse to upload"})]})}),(0,G.jsx)("input",{id:"uploadImage",type:"file",onChange:function(e){var n;if(null!==(n=e.target.files)&&void 0!==n&&n[0]){var i=e.target.files[0],t=new FormData;t.append("photo",i),ae(t)}}}),(0,G.jsxs)("div",{className:"ModalRewardUploadImg",children:[!m&&!b&&(0,G.jsx)("img",{src:T.Z.PlaceholderImg,alt:"placeholder"}),m?(0,G.jsx)("img",{src:m,alt:"img"}):(0,G.jsx)(G.Fragment,{children:b&&(0,G.jsx)("img",{src:b,alt:"img"})}),a&&(0,G.jsx)("div",{className:"ModalRewardUploadLoading",children:(0,G.jsx)(E.Z,{height:220})})]}),m&&(0,G.jsx)("div",{className:"mt-2 mb-3 text-center",children:(0,G.jsx)(B.mW,{onClick:function(){x(null)},size:"sm",color:"danger",children:"Remove Image"})})]})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:(0,G.jsxs)(Y,{children:[se.length>0&&(0,G.jsx)("div",{className:"text-center",children:(0,G.jsx)("p",{children:"Notification Recipients"})}),se.length>0?se.map((function(e,n){return(0,G.jsxs)($,{children:[(0,G.jsx)(V.Z,{data:e,checked:!0,canChecked:!1}),(0,G.jsx)(R.Z,{variant:"danger",className:"TrashBtn",onClick:function(){return le(n)},children:(0,G.jsx)(O.r,{})})]},String(n))})):(0,G.jsx)("div",{className:"text-center",children:(0,G.jsx)("p",{children:"No Notification Recipients"})}),(0,G.jsxs)(j.Z,{children:[(null===te||void 0===te||null===(n=te.users)||void 0===n?void 0:n.message)&&(0,G.jsx)(Z.Z,{xs:12,className:"px-2 text-center",children:(0,G.jsx)(ie,{children:(0,G.jsx)("p",{style:{marginBottom:0,color:"#fff"},children:String(null===te||void 0===te||null===(i=te.users)||void 0===i?void 0:i.message)})})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2 text-center",children:(0,G.jsx)(B.mW,{type:"button",onClick:de,style:{width:220},children:"Add Recipients"})})]})]})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:(0,G.jsx)(ne,{children:(0,G.jsxs)("p",{style:{marginBottom:0,color:"#000"},children:["Use this template string to mention user"," ",(0,G.jsx)("strong",{children:"[[NAME]], [[EMAIL]]"})]})})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:(0,G.jsx)(F.Qr,{name:"title",control:L,render:function(e){var n,i,t,r,s=e.field;return(0,G.jsxs)(_.Z.Group,{className:"mb-3",controlId:"formGroupName",children:[(0,G.jsx)(_.Z.Label,{children:"Notification Title"}),(0,G.jsx)(B.O1,(0,S.Z)((0,S.Z)({},s),{},{as:"textarea",rows:2,placeholder:"Input title",isInvalid:Boolean(null===te||void 0===te||null===(n=te.title)||void 0===n?void 0:n.message)})),(null===te||void 0===te||null===(i=te.title)||void 0===i?void 0:i.message)&&(0,G.jsx)(_.Z.Control.Feedback,{type:"invalid",children:null!==(t=null===te||void 0===te||null===(r=te.title)||void 0===r?void 0:r.message)&&void 0!==t?t:""})]})}})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:(0,G.jsx)(F.Qr,{name:"body",control:L,render:function(e){var n,i,t,r,s=e.field;return(0,G.jsxs)(_.Z.Group,{className:"mb-3",controlId:"formGroupName",children:[(0,G.jsx)(_.Z.Label,{children:"Notification Body"}),(0,G.jsx)(B.O1,(0,S.Z)((0,S.Z)({},s),{},{as:"textarea",rows:3,placeholder:"Notification Body",isInvalid:Boolean(null===te||void 0===te||null===(n=te.body)||void 0===n?void 0:n.message)})),(null===te||void 0===te||null===(i=te.body)||void 0===i?void 0:i.message)&&(0,G.jsx)(_.Z.Control.Feedback,{type:"invalid",children:null!==(t=null===te||void 0===te||null===(r=te.body)||void 0===r?void 0:r.message)&&void 0!==t?t:""})]})}})}),(0,G.jsx)(Z.Z,{xs:12,className:"px-2",children:(0,G.jsx)(ee,{children:(0,G.jsx)(B.mW,{type:"submit",onClick:W,children:"SEND NOTIFICATION"})})})]})}),(0,G.jsx)(H,{defaultValues:X("users"),onSubmit:ce})]})},re=i(9157),se=L.ZP.div(m||(m=(0,x.Z)(["\n    background-color: transparent;\n    padding-left: 40px;\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-bottom: 2.25rem;\n    margin-top: 1.25rem;\n    @media screen and (min-width: ",") {\n        padding: 2rem 1rem;\n        background-color: #00d02a;\n        border-radius: 0.6rem;\n        padding-left: 48px;\n    }\n    h2 {\n        color: #fff;\n        font-size: 22px;\n        font-weight: bold;\n    }\n"])),re.AV.md),le=function(){var e=(0,w.I0)(),n=(0,k.zn)().notifications_getNotificationRecipients,i=(0,k.aC)(),t=i.user,r=i.isAuthenticated,s=(0,v.s0)();(0,p.useEffect)((function(){var i;r&&"admin"===(null===t||void 0===t?void 0:t.role)?e(n(i)):s("/accessdenied")}),[t,r]);var l=(0,p.useCallback)(function(){var e=(0,f.Z)((0,h.Z)().mark((function e(n){var i;return(0,h.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,i={title:n.title,body:n.body,imageUrl:null,users:(null===n||void 0===n?void 0:n.users)||[]},e.next=4,I.ho.admin_sendGeneralNotifications(i);case 4:e.sent&&z().fire({title:"Success",text:"Notification send successfully!",icon:"success",showCancelButton:!1,confirmButtonColor:"#009c4e",confirmButtonText:"Ok"}).then((function(e){e.isConfirmed})),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),z().fire({title:"Opss..",text:"Failed to send notifications!",icon:"error",showCancelButton:!1,confirmButtonColor:"#9c0017",confirmButtonText:"Ok"}).then((function(e){e.isConfirmed}));case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(n){return e.apply(this,arguments)}}(),[]),o=(0,p.useCallback)((function(){s("/admin/notification/template")}),[s]);return(0,G.jsxs)(N.v,{children:[(0,G.jsx)(b.q,{children:(0,G.jsx)("title",{children:"Notifications"})}),(0,G.jsx)(g.Z,{fluid:!0,children:(0,G.jsx)("div",{className:"row justify-center h-auto",children:(0,G.jsx)("div",{className:"col-12 col-md-10",children:(0,G.jsx)(j.Z,{className:"justify-content-md-center",children:(0,G.jsx)(Z.Z,{children:(0,G.jsxs)("div",{className:"AdminRewardContainer",children:[(0,G.jsxs)(se,{children:[(0,G.jsx)("button",{className:"back-arrow",onClick:function(){s(-1)},children:(0,G.jsx)(C.r,{})}),(0,G.jsxs)("div",{children:[(0,G.jsx)("h2",{className:"mb-3, text-center",children:"Notification"}),(0,G.jsx)(B.mW,{color:"white",onClick:o,children:"Template"})]})]}),(0,G.jsx)(te,{onSubmit:l}),(0,G.jsx)(y.e,{})]})})})})})})]})}}}]);
//# sourceMappingURL=371.a502b4f5.chunk.js.map