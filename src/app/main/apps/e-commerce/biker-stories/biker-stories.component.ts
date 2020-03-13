import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  NgZone
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Subject } from "rxjs";

import { fuseAnimations } from "@fuse/animations";

import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { takeUntil } from "rxjs/internal/operators";
import { MatDialog, MatDialogRef } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { EcommerceBikerStories } from "./biker-stories.service";
import { Router } from "@angular/router";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import { FormControl } from "@angular/forms";
declare var FB;
export interface PeriodicElement {
  id: number;
  username: string;
  bike: string;
  city: string;
  date: string;
  price: number;
  codes: number;
}

@Component({
  selector: "e-commerce-biker-stories",
  templateUrl: "./biker-stories.component.html",
  styleUrls: ["./biker-stories.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceBikerStoriesComponent implements OnInit {
  displayedColumns = [
    "organised",
    "event",
    "location",
    "date",
    "invites",
    "going",
    "paid",
    "sold",
    "action",
    "demand"
  ];
  storiesData: any[];
  images: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  maximumposteduser: any;
  topcommentedpost: any;
  toplikedpost: any;
  selectedCity: string;
  selectedDate: string;
  selected = new FormControl(0);
  searchTerm: string;
  twitterfinalURL: any;
  infocountboxes: any;
  showCountBox: boolean;

  @ViewChild("bikerStoriesCitySearch", { static: true })
  private bikerStoriesCitySearchElementRef: ElementRef;
  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;
  @ViewChild("commentPostsSlide", { static: true }) imgpcommentEl: ElementRef;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild("filter", { static: true })
  filter: ElementRef;
  storyrefresh: Subject<any> = new Subject();

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _ecommerceProductsService: EcommerceProductsService,
    private _bikerStoriesService: EcommerceBikerStories,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private ngZone: NgZone,
    private datePipe: DatePipe
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit(): void {
    // render facebook button
    window["FB"] && window["FB"].XFBML.parse();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._bikerStoriesService.getInfoBoxes().then(data => {
      this.infocountboxes = data.BikerStories;
      this.showCountBox = true;
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.bikerStoriesCitySearchElementRef.nativeElement,
        {
          types: ["(cities)"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          this.selectedCity = place.name;
          this.citySelectionChange(this.selectedCity);
        });
      });
    });

    this.storyrefresh.subscribe(updateDB => {
      if (updateDB) {
        this._bikerStoriesService.getStories("stories");
      }
    });
    this._bikerStoriesService.myStoriesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(story => {
        if (story.Status == 1) {
          this.storiesData =
            story.Stories == undefined ? story.StoriesFeed : story.Stories;
          console.log(this.storiesData);

          //let urls = this.storiesData
          for (let i = 0; i < this.storiesData.length; i++) {
            let obj = this.storiesData[i];
            console.log(obj.ImageURLs.length);
          }
        } else {
          this.storiesData = null;
        }
      });

    this._bikerStoriesService
      .getMaximumPostedUser("bikerstoriesfilter-maximumposteduser")
      .then(data => {
        this.maximumposteduser = data.MaximumPostedUser;
      });
    this._bikerStoriesService
      .getTopCommentedPosts("bikerstoriesfilter-topcommentedpost")
      .then(data => {
        this.topcommentedpost = data.TopCommentedPost;
        console.log(this.topcommentedpost);
      });
    this._bikerStoriesService
      .getTopLikedPosts("bikerstoriesfilter-toplikedpost")
      .then(data => {
        this.toplikedpost = data.TopLikedPosts;
      });
  }
  addStyle() {}
  tabClick(event) {
    if (this.selected.value == 0) {
      console.log("Stories Feed");
    }
    if (this.selected.value == 1) {
      console.log("Maximum Posted Users");
      this._bikerStoriesService
        .getMaximumPostedUser("bikerstoriesfilter-maximumposteduser")
        .then(data => {
          this.maximumposteduser = data.MaximumPostedUser;
        });
    }
    if (this.selected.value == 2) {
      console.log("Top Liked Posts");
      this._bikerStoriesService
        .getTopLikedPosts("bikerstoriesfilter-toplikedpost")
        .then(data => {
          this.toplikedpost = data.TopLikedPosts;
        });
    }
    if (this.selected.value == 3) {
      console.log("Top Commented Posts");
      this._bikerStoriesService
        .getTopCommentedPosts("bikerstoriesfilter-topcommentedpost")
        .then(data => {
          this.topcommentedpost = data.TopCommentedPost;
        });
    }
  }
  filterBikerStoriesByName(event): void {
    if (this.selected.value == 0) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url =
          "bikerstoriesfilter-storiesfeed?QueryString=" + this.searchTerm;
        this._bikerStoriesService.getStories(url);
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._bikerStoriesService.getStories("stories").then(data => {
          this.storiesData = data.Stories;
        });
      }
    }
    if (this.selected.value == 1) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url =
          "bikerstoriesfilter-maximumposteduser?QueryString=" + this.searchTerm;
        this._bikerStoriesService.getMaximumPostedUser(url).then(data => {
          this.maximumposteduser = data.MaximumPostedUser;
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._bikerStoriesService
          .getMaximumPostedUser("bikerstoriesfilter-maximumposteduser")
          .then(data => {
            this.maximumposteduser = data.MaximumPostedUser;
          });
      }
    }
    if (this.selected.value == 3) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url =
          "bikerstoriesfilter-topcommentedpost?QueryString=" + this.searchTerm;
        this._bikerStoriesService.getTopCommentedPosts(url).then(data => {
          this.topcommentedpost = data.TopCommentedPost;
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._bikerStoriesService
          .getTopCommentedPosts("bikerstoriesfilter-topcommentedpost")
          .then(data => {
            this.topcommentedpost = data.TopCommentedPost;
          });
      }
    }
  }
  citySelectionChange(event) {
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-storiesfeed?City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }
    if (this.selected.value == 1) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url =
            "bikerstoriesfilter-maximumposteduser?City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }
    if (this.selected.value == 2) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-toplikedpost?City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }
    if (this.selected.value == 3) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-topcommentedpost?City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }

    if (this.selected.value == 0) {
      this._bikerStoriesService.getStories(url);
    }
    if (this.selected.value == 1) {
      this._bikerStoriesService.getMaximumPostedUser(url).then(data => {
        this.maximumposteduser = data.MaximumPostedUser;
      });
    }
    if (this.selected.value == 2) {
      this._bikerStoriesService.getTopLikedPosts(url).then(data => {
        this.toplikedpost = data.TopLikedPosts;
      });
    }
    if (this.selected.value == 3) {
      this._bikerStoriesService.getTopCommentedPosts(url).then(data => {
        this.topcommentedpost = data.TopCommentedPost;
      });
    }
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedCity != undefined) {
        url = "bikerstoriesfilter-storiesfeed?City=" + this.selectedCity;
      }

      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-storiesfeed?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }
    if (this.selected.value == 1) {
      if (this.selectedCity != undefined) {
        url = "bikerstoriesfilter-maximumposteduser?City=" + this.selectedCity;
      }

      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url =
            "bikerstoriesfilter-maximumposteduser?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }
    if (this.selected.value == 2) {
      if (this.selectedCity != undefined) {
        url = "bikerstoriesfilter-toplikedpost?City=" + this.selectedCity;
      }

      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-toplikedpost?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }
    if (this.selected.value == 3) {
      if (this.selectedCity != undefined) {
        url = "bikerstoriesfilter-topcommentedpost?City=" + this.selectedCity;
      }

      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "bikerstoriesfilter-topcommentedpost?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }

    if (this.selected.value == 0) {
      this._bikerStoriesService.getStories(url);
    }
    if (this.selected.value == 1) {
      this._bikerStoriesService.getMaximumPostedUser(url).then(data => {
        this.maximumposteduser = data.MaximumPostedUser;
      });
    }
    if (this.selected.value == 2) {
      this._bikerStoriesService.getTopLikedPosts(url).then(data => {
        this.toplikedpost = data.TopLikedPosts;
      });
    }
    if (this.selected.value == 3) {
      this._bikerStoriesService.getTopCommentedPosts(url).then(data => {
        this.topcommentedpost = data.TopCommentedPost;
      });
    }
  }
  openAlertDialog(): void {
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      data: {
        message: "Your Request has been Successfully Sent !",
        buttonText: {
          cancel: "Done"
        }
      }
    });
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  /**
   * Delete Story
   *
   * @param story
   */
  deleteStory(story): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._bikerStoriesService.deleteStory(story.StoryID).then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert(data.Message);
            this.storyrefresh.next(true);
          } else alert(data.Message);
        });
      }
      this.confirmDialogRef = null;
    });
  }
  setStoryId(story) {
    let id = story.StoryID;
    console.log(story.StoryID);
    this.router.navigate(["/apps/e-commerce/biker-comments", id]);
  }
  setUserProfileStory(story) {
    console.log(story);
    let id = story.UserID;
    console.log(story.UserID);
    this.router.navigate(["/apps/e-commerce/biker-profile", id]);
  }
  generateURL(story) {
    var url =
      "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/revlinkpreview?h=story";
    let storyid = story.StoryID;
    var image = story.ImageURLs[0];

    var finalimage = image.replace(
      "https://revyoursoulapp.s3.ap-south-1.amazonaws.com/",
      ""
    );
    finalimage = finalimage.replace(".png", "");
    console.log(finalimage);
    var title = story.Caption;
    var description = story.FirstName + story.LastName;
    var finalURL =
      url +
      "&p=" +
      storyid +
      "&u=" +
      finalimage +
      "&t=" +
      title +
      "&d=" +
      description;

    finalURL = finalURL.replace(" ", "%20");
    console.log(finalURL);

    FB.ui(
      {
        method: "share",
        href: finalURL
      },
      // callback
      function(response) {
        if (response && !response.error_message) {
          alert("Posting Successfully Completed.");
        } else {
          alert("Error while Posting Story.");
        }
      }
    );
  }
  generateTwitterURL(story) {
    var url =
      "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/revlinkpreview?h=story";
    let storyid = story.StoryID;
    var image = story.ImageURLs[0];

    var finalimage = image.replace(
      "https://revyoursoulapp.s3.ap-south-1.amazonaws.com/",
      ""
    );
    finalimage = finalimage.replace(".png", "");
    console.log(finalimage);
    var title = story.Caption;
    var description = story.FirstName + story.LastName;
    this.twitterfinalURL =
      url +
      "&p=" +
      storyid +
      "&u=" +
      finalimage +
      "&t=" +
      title +
      "&d=" +
      description;

    this.twitterfinalURL = this.twitterfinalURL.replace(" ", "%20");
    console.log(this.twitterfinalURL);
    window.open(
      "https://twitter.com/share?url=" +
        encodeURIComponent(this.twitterfinalURL),
      "popUpWindow",
      "height=300,width=700,left=350,top=250,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
    );
    // window.open("https://twitter.com/share?url="+encodeURIComponent(this.twitterfinalURL),'width=560,height=340');
  }
  addLikeStory(story) {
    localStorage.setItem("LikeStoryID", story.StoryID);
    this._bikerStoriesService.likeStory().then(data => {
      // Show the success message
      if (data.Status == 1) {
        alert("Biker Story liked successfully");
        this.storyrefresh.next(true);
      } else alert(data.Message);
    });
  }
}
