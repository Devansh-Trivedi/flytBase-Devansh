## Go in api directory, in terminal
```
yarn install
yarn start

> JWT Authentication
> The ability for a user to add/update/delete sites in his/her account.
> The ability for a user to add/update/delete drones under a site.
> The ability for a user to add/update/delete missions under a site.

```
![imagename](https://res.cloudinary.com/devdemo/image/upload/v1686912944/flytbase/WhatsApp_Image_2023-06-16_at_16.25.04_jejsun.jpg)

## Test all the api's using Postman

## Mission API's

## Create Mission
> http://localhost:4000/createMission
## Update Mission
> http://localhost:4000/updateMission
## Delete Mission
> http://localhost:4000/deleteMission

![imagename](https://res.cloudinary.com/devdemo/image/upload/v1686913536/flytbase/WhatsApp_Image_2023-06-16_at_16.34.54_brks3u.jpg)


## Example Payload 
```
{
    "alt": 30,
    "speed": 25,
    "name": "mission_name_2",
    "waypoints": [
        {
            "alt": 40,
            "lat": 37.42987269786578,
            "lng": -122.08320293735657
        },
        {
            "alt": 40,
            "lat": 37.42987269786578,
            "lng": -122.08320293735657
        },
        {
            "alt": 40,
            "lat": 37.42987269786578,
            "lng": -122.08320293735657
        }
    ],
    "created_at": "test_date",
    "updated_at": "test_date"
}
```


## Site API's

## Create Site
> http://localhost:4000/createSite
## Update Site
> http://localhost:4000/updateSite
## Delete Site
> http://localhost:4000/deleteSite

![imagename](https://res.cloudinary.com/devdemo/image/upload/v1686913731/flytbase/WhatsApp_Image_2023-06-16_at_16.38.28_gjazpz.jpg)


## Example Payload 
```
{
    "site_name": "Berlin",
    "position": {
        "latitude": 8.324643,
        "longitude": 72.654621
    }
}
```

## Category API's

## Create Category
> http://localhost:4000/createCategory
## Update Category
> http://localhost:4000/updateCategory
## Delete Category
> http://localhost:4000/deleteCategory

![imagename](https://res.cloudinary.com/devdemo/image/upload/v1686913880/flytbase/WhatsApp_Image_2023-06-16_at_16.40.00_kfdxi8.jpg)

## Example Payload
```
{
    "name": "Grid",
    "color": "#407BE3",
    "tag_name": "test05",
    "created_at": {
        "$date": "2023-02-02T06:40:35.306Z"
    },
    "updated_at": {
        "$date": "2023-02-02T06:41:02.533Z"
    }
}
```

## Drone API's

## Create Drone
> http://localhost:4000/createDrone
## Update Drone
> http://localhost:4000/updateDrone
## Delete Drone
> http://localhost:4000/deleteDrone

![imagename](https://res.cloudinary.com/devdemo/image/upload/v1686913731/flytbase/WhatsApp_Image_2023-06-16_at_16.38.28_gjazpz.jpg)

## Example Payload
```
{
    "drone_id": "wVQv1qs6",
    "created_at": {
        "$date": "2023-01-24T11:19:23.181Z"
    },
    "deleted_by": "0",
    "deleted_on": {
        "$date": "2023-01-24T11:21:57.992Z"
    },
    "drone_type": "Real Drone",
    "make_name": "cloudsim",
    "name": "Virtual Drone",
    "updated_at": {
        "$date": "2023-01-24T11:21:57.992Z"
    }
}
```