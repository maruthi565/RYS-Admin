import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AgmCoreModule } from "@agm/core";

import { FuseSharedModule } from "@fuse/shared.module";
import { FuseWidgetModule } from "@fuse/components/widget/widget.module";

import { RidesService } from "app/main/apps/e-commerce/rides/rides.service";
import { UsersService } from "app/main/apps/e-commerce/users/users.service";

import { EcommerceProductsComponent } from "app/main/apps/e-commerce/products/products.component";
import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { EcommerceProductComponent } from "app/main/apps/e-commerce/product/product.component";
import { EcommerceProductService } from "app/main/apps/e-commerce/product/product.service";
import { EcommerceOrdersComponent } from "app/main/apps/e-commerce/orders/orders.component";
import { EcommerceOrdersService } from "app/main/apps/e-commerce/orders/orders.service";
import { EcommerceOrderComponent } from "app/main/apps/e-commerce/order/order.component";
import { EcommerceOrderService } from "app/main/apps/e-commerce/order/order.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { EcommerceMyCouponsComponent } from "./my-coupons/my-coupons.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatDialogModule,
  MatToolbarModule,
  MatDialogRef,
  MatGridListModule,
  MatDividerModule,
  MatRadioModule,
  MatBadgeModule,
  MatAutocompleteModule
} from "@angular/material";
import { RequestDialogComponent } from "./request-dialog/request-dialog.component";
import { EcommerceAddCouponComponent } from "./add-coupon/add-coupon.component";
import { EcommerceEditCouponComponent } from "./edit-coupon/edit-coupon.component";
import { EcommercePaymentsComponent } from "./payments/payments.component";
import { EcommerceAddMerchandiseComponent } from "./add-merchandise/add-merchandise.component";
import { EcommerceProfileComponent } from "./profile/profile.component";
import { EcommerceEditMerchandiseComponent } from "./edit-merchandise/edit-merchandise.component";
import { EcommerceAfterMarketComponent } from "./after-market/after-market.component";
import { EcommerceMerchandiseProductsComponent } from "./merchandise-products/merchandise-products.component";
import { EcommerceUsersComponent } from "./users/users.component";
import { EcommerceApproveRequestsComponent } from "./approve-requests/approve-requests.component";
import { EcommercePendingProfilesComponent } from "./pending-profiles/pending-profiles.component";
import { EcommerceCreateVendorComponent } from "./create-vendor/create-vendor.component";
import { EcommerceEditVendorComponent } from "./edit-vendor/edit-vendor.component";
import { EcommerceUserPostedComponent } from "./user-posted/user-posted.component";
import { EcommerceBikeRequestComponent } from "./bike-request/bike-request.component";
import { ViewCouponComponent } from "../mail/dialogs/view-coupon/view-coupon.component";
import { AcceptCouponComponent } from "../mail/dialogs/accept-coupon/accept-coupon.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ViewProductComponent } from "../mail/dialogs/view-product/view-product.component";
import { EcommerceBusinessQueryComponent } from "./business-query/business-query.component";
import { AddBusinessQueryComponent } from "../mail/dialogs/add-business-query/add-business-query.component";
import { MailComposeDialogComponent } from "../mail/dialogs/compose/compose.component";
import { EcommerceReportComponent } from "./report/report.component";
import { ReportSendMessageComponent } from "../mail/dialogs/report-send-message/report-send-message.component";
import { AddReportTypeComponent } from "../mail/dialogs/add-report-type/add-report-type.component";
import { EcommerceFeedbackComponent } from "./feedback/feedback.component";
import { AddFeedbackTypeComponent } from "../mail/dialogs/add-feedback-type/add-feedback-type.component";
import { FeedbackSendMessageComponent } from "../mail/dialogs/feedback-send-message/feedback-send-message.component";
import { EcommerceNotificationComponent } from "./notification/notification.component";
import { EcommerceEventsComponent } from "./events/events.component";
import { EcommerceCreateEventComponent } from "./create-event/create-event.component";
import { EcommerceEditEventComponent } from "./edit-event/edit-event.component";
import { EcommerceRidesComponent } from "./rides/rides.component";
import { EcommerceCreateRideComponent } from "./create-ride/create-ride.component";
import { AddCategoryComponent } from "../mail/dialogs/add-category/add-category.component";
import { AddLeaderMessageTypeComponent } from "../mail/dialogs/add-leader-message-type/add-leader-message-type.component";
import { AddReasonTypeComponent } from "../mail/dialogs/add-reason-type/add-reason-type.component";
import { AddNewComponent } from "../mail/dialogs/add-new/add-new.component";

import { ViewBikeComponent } from "../mail/dialogs/view-bike/view-bike.component";
import { AddMerchandiseComponent } from "../mail/dialogs/add-merchandise/add-merchandise.component";
import { EditMerchandiseComponent } from "../mail/dialogs/edit-merchandise/edit-merchandise.component";
import { ViewMerchandiseComponent } from "../mail/dialogs/view-merchandise/view-merchandise.component";
import { EcommerceAdsPostedComponent } from "./ads-posted/ads-posted.component";
import { AddAdsComponent } from "../mail/dialogs/add-ads/add-ads.component";
import { EditAdsComponent } from "../mail/dialogs/edit-ads/edit-ads.component";
import { EcommerceImagesComponent } from "./images/images.component";
import { AddBikeBrandComponent } from "../mail/dialogs/add-bike-brand/add-bike-brand.component";
import { EcommerceBikeBrandDetailComponent } from "./bike-brand-detail/bike-brand-detail.component";
import { AddBikeModelComponent } from "../mail/dialogs/add-bike-model/add-bike-model.component";
import { EcommerceBikeImagesComponent } from "./bike-images/bike-images.component";
import { EcommerceBikeBrandImageComponent } from "./bike-brand-image/bike-brand-image.component";
import { AddNewImageComponent } from "../mail/dialogs/add-new-image/add-new-image.component";
import { EcommerceEventImageComponent } from "./event-image/event-image.component";
import { EcommerceRideImageComponent } from "./ride-image/ride-image.component";
import { AddEventImageComponent } from "../mail/dialogs/add-event-image/add-event-image.component";
import { EcommerceSosComponent } from "./sos/sos.component";
import { SosHomeRideDialogComponent } from "../mail/dialogs/sos-ride/sos-ride.component";
import { EcommerceBikerStoriesComponent } from "./biker-stories/biker-stories.component";
import {
  EcommerceViewRideComponent,
  TimeFormat
} from "./view-ride/view-ride.component";
import { LeaderboardComponent } from "../mail/dialogs/leaderboard/leaderboard.component";
import { AcceptProductComponent } from "../mail/dialogs/accept-product/accept-product.component";
import { EditNewImageComponent } from "../mail/dialogs/edit-new-image/edit-new-image.component";
import { EditEventImageComponent } from "../mail/dialogs/edit-event-image/edit-event-image.component";
import { EditRideImageComponent } from "../mail/dialogs/edit-ride-image/edit-ride-image.component";
import { ViewAdsPostedComponent } from "../mail/dialogs/view-ads-posted/view-ads-posted.component";
import { EcommercePreviousReportComponent } from "./previous-report/previous-report.component";
import { EcommerceVendorProfileComponent } from "./vendor-profile/vendor-profile.component";
import {
  EcommerceViewEventComponent,
  EventTimeFormat
} from "./view-event/view-event.component";
import { EcommerceCreateStoryComponent } from "./create-story/create-story.component";
import { EcommerceSendMessageComponent } from "./send-message/send-message.component";
import { EcommerceBikerProfileComponent } from "./biker-profile/biker-profile.component";
import { EcommerceBikerPostComponent } from "./biker-post/biker-post.component";
import { EcommerceBikerCommentsComponent } from "./biker-comments/biker-comments.component";
import { CreateRideService } from "app/main/apps/e-commerce/create-ride/create-ride.service";
// import { DialogContentExampleDialog } from 'app/main/apps/e-commerce/create-ride/create-ride.component';
import { EcommerceAddAdminUserComponent } from "./add-admin-user/add-admin-user.component";
import { EcommerceAddAdminUserService } from "./add-admin-user/add-admin-user.service";
import { EcommerceAdminUsersComponent } from "./admin-users/admin-users.component";
import { EcommerceAdminUsersService } from "./admin-users/admin-users.service";
import { EcommerceBikeBrandService } from "./images/images.service";
import { EcommerceAddBikeBrandService } from "../mail/dialogs/add-bike-brand/add-bike-brand.service";
import { EcommerceAdminProfileComponent } from "./admin-profile/admin-profile.component";
import { EcommerceAddBikeModelService } from "../mail/dialogs/add-bike-model/add-bike-model.service";
import { EcommerceUserProfileService } from "./profile/profile.service";
import { EcommercegetBikeModelsService } from "./bike-brand-detail/bike-brand-detail.service";
import { EcommerceAddAddsService } from "../mail/dialogs/add-ads/add-ads.service";
import { FeedbackService } from "./feedback/feedback.service";
import { EventsService } from "./events/events.service";
import { EcommerceAddBusinessQueryService } from "../mail/dialogs/add-business-query/add-business-query.service";
import { EcommerceBusinessQueryService } from "./business-query/business-query.service";
import { EcommerceAddCouponService } from "./add-coupon/add-coupon.service";
import { EcommerceGetRideComponent } from "./get-ride/get-ride.component";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { EcommerceViewRideService } from "./view-ride/view-ride.service";
import { EditNewComponent } from "../mail/dialogs/edit-new/edit-new.component";
import { EcommerceUserPostedService } from "./user-posted/user-posted.service";
import { EcommerceCreateVendorService } from "./create-vendor/create-vendor.service";

import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { EcommerceAddSosCountriesComponent } from "./add-sos-countries/add-sos-countries.component";
import { EcommerceSosCountriesComponent } from "./sos-countries/sos-countries.component";
import { EcommerceAddFeedbackService } from "../mail/dialogs/add-feedback-type/add-feedback-type.service";
import { MyCouponsService } from "./my-coupons/my-coupons.service";
import { EcommerceBikerStories } from "./biker-stories/biker-stories.service";
import { EcommerceAddSosContactsService } from "./add-sos-countries/add-sos-countries.service";
import { EcommerceSOSContactsService } from "./sos-countries/sos-countries.service";
import { DialogOverviewExampleDialog } from "./profile/dialog-overview-example-dialog";
import { SOSActivityService } from "./sos/sos.service";

import { DialogContentExampleDialog } from "./create-ride/dialog-content-example-dialog";
import { EditRideService } from "./edit-ride/edit-ride.service";
import { EcommerceSOSRideService } from "../mail/dialogs/sos-ride/sos-ride.service";
import { EcommerceBikerCommentsService } from "./biker-comments/biker-comments.service";
import { EcommerceAddReportTypeService } from "../mail/dialogs/add-report-type/add-report-type.service";
import { EcommerceAdddLeaderboardMessageTypeService } from "../mail/dialogs/add-leader-message-type/add-leader-message-type.service";

import { DatePipe } from "@angular/common";
import { LeaderboardService } from "../mail/dialogs/leaderboard/leaderboard.service";
import { EcommerceBikeUserPostedService } from "./bike-request/bike-request.service";
import { EditPostComponent } from "../mail/dialogs/edit-post/edit-post.component";
import { AddPostComponent } from "../mail/dialogs/add-post/add-post.component";
import { EditBikeBrandDialog } from "../mail/dialogs/edit-bike-brand/edit-bike-brand.component";
import { EcommerceEditBikeBrandService } from "../mail/dialogs/edit-bike-brand/edit-bike-brand.service";
import { EcommerceAddPaymentComponent } from "./add-payment/add-payment.component";
import { EcommerceAddAdminUserPostedBikeService } from "../mail/dialogs/add-new/add-new.service";
import { EcommerceAddAdminUserMerchandiseService } from "../mail/dialogs/add-merchandise/add-merchandsie.service";
import { EditBikeModelDialog } from "../mail/dialogs/edit-bike-model/edit-bike-model.component";
import { EcommerceEditBikeModelService } from "../mail/dialogs/edit-bike-model/edit-bike-model.service";
import { EventDialogContentExampleDialog } from "./create-event/dialog-content-event-example-dialog";
import { EcommerceAdsService } from "./ads-posted/ads-posted.service";
import { EcommerceEditRideComponent } from "./edit-ride/edit-ride.component";
import { EcommerceEditAdsService } from "../mail/dialogs/edit-ads/edit-ads.service";
import { EcommerceEditUserBikeService } from "../mail/dialogs/edit-new/edit-new.service";
import { EcommerceAddStoryService } from "./create-story/create-story.service";
import { EcommerceBikerProfileService } from "./biker-profile/biker-profile.service";
import { EcommerceAddCategoryService } from "../mail/dialogs/add-category/add-category.service";
import { EcommerceReportsService } from "./report/report.service";
import { EcommerceAddEventImageService } from "../mail/dialogs/add-event-image/add-event-image.service";
import { EcommerceEventImagesService } from "./event-image/event-image.service";
import { EcommerceEditEventImageService } from "../mail/dialogs/edit-event-image/edit-event-image.service";
import { EcommerceAddRideImageService } from "../mail/dialogs/add-ride-image/add-ride-image.service";
import { AddRideImageDialog } from "../mail/dialogs/add-ride-image/add-ride-image.component";
import { EcommerceRideImagesService } from "./ride-image/ride-image.service";
import { EcommerceEditRideImageService } from "../mail/dialogs/edit-ride-image/edit-ride-image.service";
import { AddSendMessageDialog } from "../mail/dialogs/add-send-message/add-send-message.component";
import { UserBikeDialog } from "../mail/dialogs/user-bike/user-bike.component";
import { UserMerchandiseDialog } from "../mail/dialogs/user-merchandise/user-merchandise.component";
import { EcommerceEditUserMerchandiseService } from "../mail/dialogs/edit-merchandise/edit-merchandise.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardService } from "./dashboard/dashboard.service";
import { EcommerceAfterMarketService } from "./after-market/after-market.service";
import { EcommerceCreateCouponService } from "./create-coupon/create-coupon.service";
import { EcommerceCreateCouponComponent } from "./create-coupon/create-coupon.component";
import { NgxImageCompressService } from "ngx-image-compress";
import { EcommerceEditCouponService } from "./edit-coupon/edit-coupon.service";
import { EcommerceAddMerchandiseService } from "./add-merchandise/add-merchandise.service";
import { EcommerceEditEventService } from "./edit-event/edit-event.service";
import { EcommerceMerchandiseService } from "./merchandise-products/merchandise-products.service";
import { EcommerceCreateMerchandiseComponent } from "./create-merchandise/create-merchandise.component";
import { EcommerceCreateMerchandiseService } from "./create-merchandise/create-merchandise.service";
import { EcommerceViewEventsService } from "./view-event/view-event.service";
import { EcommerceAddPaymentService } from "./add-payment/add-payment.service";
import { EcommerceVendorProfileService } from "./vendor-profile/vendor-profile.service";
import { ViewCouponDialogService } from "../mail/dialogs/view-coupon/view-coupon.service";
import { EcommerceEditMerchandiseService } from "./edit-merchandise/edit-merchandise.service";
import { ViewProductDialogService } from "../mail/dialogs/view-product/view-product.service";
import { EcommerceEditVendorService } from "./edit-vendor/edit-vendor.service";
import { EcommerceApproveRequestsService } from "./approve-requests/approve-requests.service";
import { JwSocialButtonsModule } from "jw-angular-social-buttons";
import { EcommercePreviousReportsService } from "./previous-report/previous-report.service";
import { EcommerceAddUserReportTypeService } from "../mail/dialogs/add-send-message/add-send-message.service";
import { EcommerceReportsSendMessageService } from "../mail/dialogs/report-send-message/report-send-message.service";
import { EcommerceAddReasonTypeService } from "../mail/dialogs/add-reason-type/add-reason-type.service";
import { EcommerceSendMessageService } from "./send-message/send-message.service";
import { EcommerceSendFeedbackMessageService } from "../mail/dialogs/feedback-send-message/feedback-send-message.service";
import { EcommerceSendSOSMessageService } from "../mail/dialogs/sos-send-message/sos-send-message.service";
import { SOSSendMessageComponent } from "../mail/dialogs/sos-send-message/sos-send-message.component";
import { EcommerceSendRejectMessageService } from "../mail/dialogs/reject-send-message/reject-send-message.service";
import { RejectSendMessageDialog } from "../mail/dialogs/reject-send-message/reject-send-message.component";
import { MatSelectSearchModule } from "./mat-select-search/mat-select-search.module";

const routes: Routes = [
  {
    path: "products",
    component: EcommerceProductsComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "biker-profile/:id",
    component: EcommerceBikerProfileComponent,
    resolve: {
      data: EcommerceBikerProfileService
    }
  },
  {
    path: "business-query",
    component: EcommerceBusinessQueryComponent,
    resolve: {
      data: EcommerceBusinessQueryService,
      EcommerceAddBusinessQueryService
    }
  },
  {
    path: "report",
    component: EcommerceReportComponent,
    resolve: {
      data: EcommerceProductsService,
      EcommerceAddReportTypeService,
      EcommerceReportsService,
      EcommerceAddUserReportTypeService,
      EcommerceReportsSendMessageService
    }
  },
  {
    path: "previous-report",
    component: EcommercePreviousReportComponent,
    resolve: {
      data: EcommercePreviousReportsService
    }
  },
  {
    path: "feedback",
    component: EcommerceFeedbackComponent,
    resolve: {
      data: FeedbackService,
      EcommerceAddFeedbackService,
      EcommerceSendFeedbackMessageService
    }
  },
  {
    path: "notification",
    component: EcommerceNotificationComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "events",
    component: EcommerceEventsComponent,
    resolve: {
      data: EventsService
    }
  },
  {
    path: "rides",
    component: EcommerceRidesComponent,
    resolve: {
      data: RidesService
    }
  },
  {
    path: "create-event",
    component: EcommerceCreateEventComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "view-event",
    component: EcommerceViewEventComponent,
    resolve: {
      data: EcommerceViewEventsService
    }
  },
  {
    path: "view-ride",
    component: EcommerceViewRideComponent,
    resolve: {
      data: EcommerceViewRideService
    }
  },
  {
    path: "create-ride",
    component: EcommerceCreateRideComponent,
    resolve: {
      data: CreateRideService
    }
  },
  {
    path: "edit-ride",
    component: EcommerceEditRideComponent,
    resolve: {
      data: EditRideService
    }
  },
  {
    path: "edit-event",
    component: EcommerceEditEventComponent,
    resolve: {
      data: EcommerceEditEventService
    }
  },
  {
    path: "after-market",
    component: EcommerceAfterMarketComponent,
    resolve: {
      data: EcommerceProductsService,
      EcommerceAddCategoryService,
      EcommerceAfterMarketService
    }
  },
  {
    path: "merchandise-products/:id",
    component: EcommerceMerchandiseProductsComponent,
    resolve: {
      data: EcommerceMerchandiseService,
      ViewProductDialogService
    }
  },

  {
    path: "users",
    component: EcommerceUsersComponent,
    resolve: {
      data: UsersService,
      EcommerceAdddLeaderboardMessageTypeService,
      LeaderboardService,
      EcommerceSendRejectMessageService
    }
  },
  {
    path: "approve-requests",
    component: EcommerceApproveRequestsComponent,
    resolve: {
      data: EcommerceApproveRequestsService
    }
  },
  {
    path: "pending-profiles",
    component: EcommercePendingProfilesComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "create-vendor",
    component: EcommerceCreateVendorComponent,
    resolve: {
      data: EcommerceCreateVendorService
    }
  },
  {
    path: "edit-vendor",
    component: EcommerceEditVendorComponent,
    resolve: {
      data: EcommerceEditVendorService
    }
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    resolve: {
      data: DashboardService
    }
  },
  {
    path: "user-posted",
    component: EcommerceUserPostedComponent,
    resolve: {
      data: EcommerceUserPostedService,
      EcommerceAddAdminUserPostedBikeService,
      EcommerceEditUserBikeService,
      EcommerceEditUserMerchandiseService,
      EcommerceAddReasonTypeService
    }
  },
  {
    path: "ads-posted",
    component: EcommerceAdsPostedComponent,
    resolve: {
      data: EcommerceAdsService,
      EcommerceAddAddsService,
      EcommerceEditAdsService
    }
  },
  {
    path: "images",
    component: EcommerceImagesComponent,
    resolve: {
      data: EcommerceBikeBrandService,
      EcommerceAddBikeBrandService
      //EcommerceEditBikeBrandService
    }
  },
  {
    path: "bike-images",
    component: EcommerceBikeImagesComponent,
    resolve: {
      data: EcommerceProductsService,
      EcommerceBikeBrandService
    }
  },
  {
    path: "biker-stories",
    component: EcommerceBikerStoriesComponent,
    resolve: {
      data: EcommerceBikerStories
    }
  },
  {
    path: "biker-post/:id",
    component: EcommerceBikerPostComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "biker-comments/:id",
    component: EcommerceBikerCommentsComponent,
    resolve: {
      data: EcommerceBikerCommentsService
    }
  },
  {
    path: "create-story",
    component: EcommerceCreateStoryComponent,
    resolve: {
      data: EcommerceAddStoryService
    }
  },
  {
    path: "bike-brand-detail/:id",
    component: EcommerceBikeBrandDetailComponent,
    resolve: {
      data: EcommercegetBikeModelsService,
      EcommerceAddBikeModelService,
      EcommerceEditBikeModelService
    }
  },
  {
    path: "bike-brand-image",
    component: EcommerceBikeBrandImageComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "event-image",
    component: EcommerceEventImageComponent,
    resolve: {
      data: EcommerceAddEventImageService,
      EcommerceEventImagesService,
      EcommerceEditEventImageService
    }
  },
  {
    path: "ride-image",
    component: EcommerceRideImageComponent,
    resolve: {
      data: EcommerceRideImagesService,
      EcommerceAddRideImageService,
      EcommerceEditRideImageService
    }
  },
  {
    path: "bike-request",
    component: EcommerceBikeRequestComponent,
    resolve: {
      data: EcommerceBikeUserPostedService,
      EcommerceAddAdminUserMerchandiseService
    }
  },
  {
    path: "sos",
    component: EcommerceSosComponent,
    resolve: {
      data: SOSActivityService,
      EcommerceSOSRideService,
      EcommerceSendSOSMessageService
    }
  },

  {
    path: "add-merchandise",
    component: EcommerceAddMerchandiseComponent,
    resolve: {
      data: EcommerceAddMerchandiseService
    }
  },
  {
    path: "edit-merchandise",
    component: EcommerceEditMerchandiseComponent,
    resolve: {
      data: EcommerceEditMerchandiseService
    }
  },
  {
    path: "get-ride",
    component: EcommerceGetRideComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },
  {
    path: "my-coupons/:id",
    component: EcommerceMyCouponsComponent,
    resolve: {
      data: MyCouponsService,
      ViewCouponDialogService
    }
  },
  {
    path: "add-coupon",
    component: EcommerceAddCouponComponent,
    resolve: {
      data: EcommerceAddCouponService
    }
  },
  {
    path: "create-coupon",
    component: EcommerceCreateCouponComponent,
    resolve: {
      data: EcommerceCreateCouponService
    }
  },
  {
    path: "send-message",
    component: EcommerceSendMessageComponent,
    resolve: {
      data: EcommerceSendMessageService
    }
  },

  {
    path: "add-admin-user",
    component: EcommerceAddAdminUserComponent,
    resolve: {
      data: EcommerceAddAdminUserService
    }
  },
  {
    path: "edit-coupon",
    component: EcommerceEditCouponComponent,
    resolve: {
      data: EcommerceEditCouponService
    }
  },
  {
    path: "payments",
    component: EcommercePaymentsComponent,
    resolve: {
      data: EcommerceProductsService
    }
  },

  {
    path: "profile",
    component: EcommerceProfileComponent,
    resolve: {
      data: EcommerceUserProfileService
    }
  },
  {
    path: "vendor-profile",
    component: EcommerceVendorProfileComponent,
    resolve: {
      data: EcommerceVendorProfileService
    }
  },
  {
    path: "products/:id",
    component: EcommerceProductComponent,
    resolve: {
      data: EcommerceProductService
    }
  },
  {
    path: "products/:id/:handle",
    component: EcommerceProductComponent,
    resolve: {
      data: EcommerceProductService
    }
  },
  {
    path: "admin-profile",
    component: EcommerceAdminProfileComponent
  },
  {
    path: "orders",
    component: EcommerceOrdersComponent,
    resolve: {
      data: EcommerceOrdersService
    }
  },

  {
    path: "orders/:id",
    component: EcommerceOrderComponent,
    resolve: {
      data: EcommerceOrderService
    }
  },

  {
    path: "admin-users",
    component: EcommerceAdminUsersComponent,
    resolve: {
      data: EcommerceAdminUsersService
    }
  },
  {
    path: "add-sos-countries",
    component: EcommerceAddSosCountriesComponent,
    resolve: {
      data: EcommerceAddSosContactsService
    }
  },
  {
    path: "sos-contacts",
    component: EcommerceSosCountriesComponent,
    resolve: {
      data: EcommerceSOSContactsService
    }
  },
  {
    path: "create-merchandise",
    component: EcommerceCreateMerchandiseComponent,
    resolve: {
      data: EcommerceCreateMerchandiseService
    }
  },
  {
    path: "add-payment",
    component: EcommerceAddPaymentComponent,
    resolve: {
      data: EcommerceAddPaymentService
    }
  }
];

@NgModule({
  declarations: [
    TimeFormat,
    EventTimeFormat,
    EcommerceProductsComponent,
    EcommerceProductComponent,
    EcommerceOrdersComponent,
    EcommerceOrderComponent,
    EcommerceMyCouponsComponent,
    RequestDialogComponent,
    EcommerceAddCouponComponent,
    EcommerceEditCouponComponent,
    EcommercePaymentsComponent,
    EcommerceAddMerchandiseComponent,
    EcommerceProfileComponent,
    EcommerceEditMerchandiseComponent,
    ViewCouponComponent,
    EcommerceAfterMarketComponent,
    EcommerceMerchandiseProductsComponent,
    EcommerceUsersComponent,
    EcommerceCreateCouponComponent,
    EcommerceApproveRequestsComponent,
    EcommercePendingProfilesComponent,
    EcommerceCreateVendorComponent,
    EcommerceEditVendorComponent,
    EcommerceUserPostedComponent,
    EcommerceBikeRequestComponent,
    AcceptCouponComponent,
    ViewProductComponent,
    EcommerceBusinessQueryComponent,
    AddBusinessQueryComponent,
    EcommerceReportComponent,
    ReportSendMessageComponent,
    AddReportTypeComponent,
    EcommerceFeedbackComponent,
    AddFeedbackTypeComponent,
    FeedbackSendMessageComponent,
    EcommerceNotificationComponent,
    EcommerceEventsComponent,
    EcommerceCreateEventComponent,
    EcommerceEditEventComponent,
    EcommerceRidesComponent,
    EcommerceCreateRideComponent,
    EcommerceEditRideComponent,
    AddCategoryComponent,
    AddLeaderMessageTypeComponent,
    AddReasonTypeComponent,
    AddNewComponent,
    EditNewComponent,
    ViewBikeComponent,
    AddMerchandiseComponent,
    EditMerchandiseComponent,
    ViewMerchandiseComponent,
    EcommerceAdsPostedComponent,
    AddAdsComponent,
    EditAdsComponent,
    EcommerceImagesComponent,
    AddBikeBrandComponent,
    EcommerceBikeBrandDetailComponent,
    AddBikeModelComponent,
    EcommerceBikeImagesComponent,
    EcommerceBikeBrandImageComponent,
    AddNewImageComponent,
    EcommerceEventImageComponent,
    EcommerceRideImageComponent,
    AddEventImageComponent,
    EcommerceSosComponent,
    SosHomeRideDialogComponent,
    EcommerceBikerStoriesComponent,
    EcommerceViewRideComponent,
    LeaderboardComponent,
    AcceptProductComponent,
    EditNewImageComponent,
    EditEventImageComponent,
    EditRideImageComponent,
    ViewAdsPostedComponent,
    EcommercePreviousReportComponent,
    EcommerceVendorProfileComponent,
    EcommerceViewEventComponent,
    EcommerceCreateStoryComponent,
    EcommerceSendMessageComponent,
    EcommerceBikerProfileComponent,
    EcommerceBikerPostComponent,
    EcommerceBikerCommentsComponent,
    DialogContentExampleDialog,
    EcommerceAddAdminUserComponent,
    EcommerceAdminUsersComponent,
    EcommerceAdminProfileComponent,
    EcommerceGetRideComponent,
    EcommerceSosCountriesComponent,
    EcommerceAddSosCountriesComponent,
    DialogOverviewExampleDialog,
    AddPostComponent,
    EditPostComponent,
    EditBikeBrandDialog,
    EcommerceAddPaymentComponent,
    EditBikeModelDialog,
    EventDialogContentExampleDialog,
    AddRideImageDialog,
    AddSendMessageDialog,
    UserBikeDialog,
    UserMerchandiseDialog,
    DashboardComponent,
    EcommerceCreateMerchandiseComponent,
    SOSSendMessageComponent,
    RejectSendMessageDialog
  ],
  entryComponents: [
    SOSSendMessageComponent,
    RequestDialogComponent,
    ViewCouponComponent,
    AcceptCouponComponent,
    ViewProductComponent,
    AddBusinessQueryComponent,
    ReportSendMessageComponent,
    AddReportTypeComponent,
    AddFeedbackTypeComponent,
    FeedbackSendMessageComponent,
    AddCategoryComponent,
    AddLeaderMessageTypeComponent,
    AddReasonTypeComponent,
    AddNewComponent,
    EditNewComponent,
    ViewBikeComponent,
    AddMerchandiseComponent,
    EditMerchandiseComponent,
    ViewMerchandiseComponent,
    AddAdsComponent,
    EditAdsComponent,
    AddBikeBrandComponent,
    AddBikeModelComponent,
    AddNewImageComponent,
    AddEventImageComponent,
    SosHomeRideDialogComponent,
    LeaderboardComponent,
    AcceptProductComponent,
    EditNewImageComponent,
    EditEventImageComponent,
    EditRideImageComponent,
    ViewAdsPostedComponent,
    DialogContentExampleDialog,
    DialogOverviewExampleDialog,
    EditBikeBrandDialog,
    EditBikeModelDialog,
    EventDialogContentExampleDialog,
    AddRideImageDialog,
    AddSendMessageDialog,
    UserBikeDialog,
    UserMerchandiseDialog,
    RejectSendMessageDialog
  ],
  imports: [
    RouterModule.forChild(routes),
    MatAutocompleteModule,
    MatSelectSearchModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    FlexLayoutModule,
    FuseWidgetModule,
    MatSlideToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    MatGridListModule,
    MatDividerModule,
    MatRadioModule,
    MatMenuModule,
    MatBadgeModule,
    JwSocialButtonsModule,
    MatCarouselModule.forRoot(),

    NgxChartsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8"
    }),

    FuseSharedModule,
    FuseSidebarModule,
    FuseWidgetModule,
    FuseConfirmDialogModule
  ],
  providers: [
    EcommerceProductsService,
    EcommerceProductService,
    EcommerceOrdersService,
    EcommerceOrderService,
    RidesService,
    CreateRideService,
    UsersService,
    EcommerceAddAdminUserService,
    EcommerceAdminUsersService,
    EcommerceBikeBrandService,
    EcommerceAddBikeBrandService,
    EcommerceAddBikeModelService,
    EcommerceUserProfileService,
    EcommercegetBikeModelsService,
    EcommerceAddAddsService,
    FeedbackService,
    EventsService,
    EcommerceAddBusinessQueryService,
    EcommerceBusinessQueryService,
    EcommerceAddCouponService,
    EcommerceViewRideService,
    EcommerceUserPostedService,
    EcommerceCreateVendorService,
    EcommerceAddFeedbackService,
    MyCouponsService,
    EcommerceBikerStories,
    EcommerceAddSosContactsService,
    EcommerceSOSContactsService,
    SOSActivityService,
    EditRideService,
    EcommerceSOSRideService,
    EcommerceBikerCommentsService,
    EcommerceAddReportTypeService,
    EcommerceAdddLeaderboardMessageTypeService,
    DatePipe,
    LeaderboardService,
    EcommerceBikeUserPostedService,
    EcommerceEditBikeBrandService,
    EcommerceAddAdminUserPostedBikeService,
    EcommerceAddAdminUserMerchandiseService,
    EcommerceEditBikeModelService,
    EcommerceAdsService,
    EcommerceEditAdsService,
    EcommerceEditUserBikeService,
    EcommerceAddStoryService,
    EcommerceBikerProfileService,
    EcommerceAddCategoryService,
    EcommerceReportsService,
    EcommerceAddEventImageService,
    EcommerceEventImagesService,
    EcommerceEditEventImageService,
    EcommerceAddRideImageService,
    EcommerceRideImagesService,
    EcommerceEditRideImageService,
    EcommerceEditUserMerchandiseService,
    DashboardService,
    EcommerceAfterMarketService,
    EcommerceCreateCouponService,
    NgxImageCompressService,
    EcommerceEditCouponService,
    EcommerceAddMerchandiseService,
    EcommerceEditEventService,
    EcommerceCreateMerchandiseService,
    EcommerceViewEventsService,
    EcommerceAddPaymentService,
    EcommerceVendorProfileService,
    ViewCouponDialogService,
    EcommerceEditMerchandiseService,
    ViewProductDialogService,
    EcommerceEditVendorService,
    EcommerceApproveRequestsService,
    EcommercePreviousReportsService,
    EcommerceAddUserReportTypeService,
    EcommerceReportsSendMessageService,
    EcommerceAddReasonTypeService,
    EcommerceSendMessageService,
    EcommerceSendFeedbackMessageService,
    EcommerceSendSOSMessageService,
    EcommerceSendRejectMessageService
  ]
})
export class EcommerceModule {}
