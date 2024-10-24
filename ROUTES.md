# Registered Routes

## Api

| Serial | Route | Path |
| ------ | ----- | ---- |
| 1 | about.list | /api/about |
| 2 | about.update | /api/about/update |
| 3 | auth.me | /api/auth/me |
| 4 | auth.signup | /api/auth/signup |
| 5 | auth.signin | /api/auth/signin |
| 6 | auth.signout | /api/auth/signout |
| 7 | auth.verify | /api/auth/verify-email |
| 8 | banner.list | /api/banner |
| 9 | banner.add | /api/banner/add |
| 10 | blog.list | /api/blog |
| 11 | blog.create | /api/blog |
| 12 | blog.single | /api/blog/:id |
| 13 | blog.like | /api/blog/like/:id |
| 14 | blog.comment | /api/blog/comment/:id |
| 15 | blog.reply | /api/blog/reply/:id |
| 16 | booking.list | /api/booking |
| 17 | booking.single | /api/booking/:id |
| 18 | booking.create | /api/booking |
| 19 | booking.update | /api/booking/:id |
| 20 | categories.all | /api/categories |
| 21 | categories.single | /api/categories/:id |
| 22 | categories.single.create | /api/categories |
| 23 | categories.single.update | /api/categories/:id |
| 24 | categories.single.delete | /api/categories/:id |
| 25 | contact.all | /api/contact |
| 26 | products.all | /api/products |
| 27 | products.single | /api/products/:id |
| 28 | products.single.create | /api/products |
| 29 | products.email | /api/products/email |
| 30 | products.single.update | /api/products/:id |
| 31 | products.single.delete | /api/products/:id |
| 32 | users.all | /api/users |
| 33 | users.single | /api/users/:id |
| 34 | users.single.update | /api/users/:id |
| 35 | users.single.update.avatar | /api/users/:id/avatar |
| 36 | users.single.update.password | /api/users/:id/password |
| 37 | users.single.delete | /api/users/:id |
| 38 | www.booking.ui.create | /api/booking/:serviceId |
| 39 | www.bookedservice.ui.create | /api/booking/create/:id |
| 40 | www.booking.ui.list | /api/bookings |
| 41 | www.booking.ui.details | /api/booking/details/:id |
| 42 | www.list.home | /api/home |
| 43 | www.searchProductsByCategory | /api/service/search |

## Dashboard

| Serial | Route | Path |
| ------ | ----- | ---- |
| 1 | contact.ui | /dashboard/contact |
| 2 | about.list.ui | /dashboard/about |
| 3 | about.single.update.http | /dashboard/upddate/about |
| 4 | banner.list.ui | /dashboard/banner |
| 5 | banner.single.create.ui | /dashboard/banner/create |
| 6 | banner.single.update.ui | /dashboard/banner/:id/edit |
| 7 | banner.single.create.http | /dashboard/banner/post |
| 8 | banner.single.update.http | /dashboard/banner/:id |
| 9 | banner.single.delete.http | /dashboard/banner/:id |
| 10 | blog.list.ui | /dashboard/blog |
| 11 | blog.single.create.ui | /dashboard/blog/create |
| 12 | blog.single.view.ui | /dashboard/blog/:id/view |
| 13 | blog.single.create.http | /dashboard/blog/post |
| 14 | blog.single.delete.ui | /dashboard/blog/:id/delete |
| 15 | booking.list.ui | /dashboard/booking |
| 16 | booking.single.update.http | /dashboard/booking/update-status/:id |
| 17 | category.list.ui | /dashboard/categories |
| 18 | category.single.create.ui | /dashboard/categories/create |
| 19 | category.single.update.ui | /dashboard/categories/:id/edit |
| 20 | category.single.create.http | /dashboard/categories |
| 21 | category.single.update.http | /dashboard/categories/:id |
| 22 | category.single.delete.http | /dashboard/categories/:id |
| 23 | contact.list.ui | /dashboard/contact |
| 24 | dashboard.stats.ui | /dashboard/stats |
| 25 | products.list.ui | /dashboard/products |
| 26 | products.single.create.ui | /dashboard/products/create |
| 27 | products.single.update.ui | /dashboard/products/:id/edit |
| 28 | products.email.http | /dashboard/products/email |
| 29 | products.single.create.http | /dashboard/products |
| 30 | products.single.update.http | /dashboard/products/:id/update |
| 31 | products.single.delete.http | /dashboard/products/:id/delete |
| 32 | productactivate.http | /dashboard/products/:id/activate |
| 33 | users.list.ui | /dashboard/users |
| 34 | users.single.delete.http | /dashboard/users/:id |
| 35 | www.about.ui | /dashboard/about |
| 36 | www.blog.ui | /dashboard/blog |
| 37 | www.blog.single.ui | /dashboard/blog/:id/view |
| 38 | www.blog.comment.http | /dashboard/comments/:id |
| 39 | www.blog.reply.http | /dashboard/blog/:commentId/reply/:blogId |
| 40 | www.contact.ui | /dashboard/contact |
| 41 | www.contact.http | /dashboard/contact |
| 42 | www.profile.ui | /dashboard/profile |
| 43 | www.profile.update.http | /dashboard/profile/update |
| 44 | www.service.ui | /dashboard/service |

## Auth

| Serial | Route | Path |
| ------ | ----- | ---- |
| 1 | auth.admin.signin.ui | /auth/admin/signin |
| 2 | auth.admin.signin.http | /auth/signin |
| 3 | auth.admin.signout.http | /auth/signout |
| 4 | auth.signup.ui | /auth/signup |
| 5 | auth.signin.ui | /auth/signin |
| 6 | auth.verify.ui | /auth/verify-email |
| 7 | auth.signup.http | /auth/signup |
| 8 | auth.signin.http | /auth/signin |
| 9 | auth.signout.http | /auth/signout |
| 10 | auth.verify.http | /auth/verify |

