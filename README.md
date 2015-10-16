# api-mysql
delimiter $$

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL auto_increment,
  `email` varchar(45) default NULL,
  `password` varchar(45) default NULL,
  `otp` varchar(45) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1$$



delimiter $$

CREATE TABLE `tbl_posts` (
  `post_id` int(11) NOT NULL auto_increment,
  `post` varchar(45) default NULL,
  `user_id` varchar(45) default NULL,
  `post_image` blob,
  PRIMARY KEY  (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1$$


delimiter $$

CREATE TABLE `tbl_polls` (
  `id` int(11) NOT NULL,
  `poll_data` varchar(45) default NULL,
  `poll_startdate` timestamp NULL default NULL,
  `poll_enddate` timestamp NULL default NULL,
  `result` varchar(45) default NULL,
  `last_update_on` timestamp NULL default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$

delimiter $$

CREATE TABLE `tbl_login_histroy` (
  `id` int(11) NOT NULL,
  `user_id` varchar(45) default NULL,
  `login_time` timestamp NULL default NULL,
  `logout_time` timestamp NULL default NULL,
  `last_updated_time` timestamp NULL default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$





delimiter $$

CREATE TABLE `tbl_comments` (
  `comment_id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `user_id` int(11) default NULL,
  `comment` varchar(45) default NULL,
  PRIMARY KEY  (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1$$

