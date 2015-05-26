from BeautifulSoup import BeautifulStoneSoup
import time


BOTTOM_TIME_THRESHOLD	   = 1.5	#in meters.  All time spend within this much of max_depth is considered bottom_time
SPEED_MEASURE_INTERVAL	   = 3		#in seconds. For maximum descent and ascent speeds
STROKE_MEASURE_INTERVAL    = 1		#in seconds. Compute speeds with this sample rate for the stroke computations
FREEFALL_ABSOLUTE_DEPTH    = 40.0	#in meters.  Whatever happened... assume freefall from this depth. 
TURN_PULL_THRESHOLD	   = 3.0	#in meters.  Don't look for strokes when within this distance after the turn because first we will have a pull
STROKE_MIN_SPEED_INCREMENT = 0.3	#in m/s.     Speed should increase by at least this much to consider it a stroke
STROKE_MAX_DURATION        = 10		#in seconds. Stroke+glide takes at max this long. Assume freefall/floatup after this period.

#XXX might just as well get rid of these now!
FLOATUP_MINIMUM_TIME       = 1		#in seconds. Don't look for strokes in the last part of the dive


class DiveProfile(object):

	def __init__(self, sample):
		self.seconds_per_sample = float(sample.delta.string)
		if self.seconds_per_sample > 1.0:
			print 'Error: at the moment the number of seconds per sample should be no more than 1.00 (%.2f given)' % self.seconds_per_sample
			from sys import exit
			exit(-1)
		elif self.seconds_per_sample < 0.9:
			print 'Warning: number of seconds per sample should be 1.00, other samplerates have not been tested yet (%.02f given)' %  self.seconds_per_sample
			
		dive                = sample.findParent('dive')
		self.dive_location  = dive.place.string
		self.dive_timestamp = time.asctime(time.strptime("%04d-%02d-%02d %02d:%02d:%02d" % ( 
			int(dive.date.year.string), int(dive.date.month.string) , int(dive.date.day.string), 
			int(dive.time.hour.string), int(dive.time.minute.string), int(dive.time.second.string)),
			"%Y-%m-%d %H:%M:%S"))
		
		self._sampledata = self._cleanupSampleData(sample)
		
		self.dive_time  = self._sampledata[-1][1]
		
		self.average_descent_speed, self.max_descent_speed, self.max_descent_speed_time, self.average_ascent_speed , self.max_ascent_speed , self.max_ascent_speed_time , self.stroke_speed = self._computeSpeeds()

		self.max_depth, self.max_depth_time = self._maxDepth()
		self.bottom_time = self._bottomTime()

		self.freefall_depth, self.freefall_time, self.strokes_descent, self.strokes_ascent, self.floatup_depth, self.floatup_time = self._strokes()


	def _cleanupSampleData(self, sample):
		tt = [float(t.string) for t in sample.findAll('t')]
		dd = [float(d.string) for d in sample.findAll('d')]
		assert len(tt) <= len(dd)
		while len(tt) < len(dd):
			tt.append(len(tt) * self.seconds_per_sample)

		#clean up samples by ignoring duplicate data (d) with the same timestamp (t)
		sampledata = [] #index, timestamp, depth
		last_t = -1
		for i, _ in enumerate(dd):
			d = dd[i]
			t = tt[i] #t = int(tt[i]) * self.seconds_per_sample
			if last_t != t:
				last_t = t
				sampledata.append((len(sampledata), t, d))

		return sampledata


	def _maxDepth(self):
		max_depth = 0.0
		max_depth_time = 0

		for _, timestamp, depth in self._sampledata:
			if depth > max_depth:
				max_depth = depth
				max_depth_time = timestamp

		return max_depth, max_depth_time


	def _computeSpeeds(self):	#Compute max&avg descent&ascent speeds
		max_depth = 0.0
		max_depth_time = 0
		max_descent_speed = max_ascent_speed = speed = strokespeed = 0.0
		max_descent_speed_time = max_ascent_speed_time = 0
		stroke_speed = []	#

		for index, timestamp, depth in self._sampledata:		
			interval_begin_index = int(index - SPEED_MEASURE_INTERVAL / self.seconds_per_sample)
			if interval_begin_index >= 0:	#far enough into the dive to have a speed measure interval
				ref_depth = self._sampledata[interval_begin_index][2]
				speed = abs((depth - ref_depth) / SPEED_MEASURE_INTERVAL)
			if depth > max_depth:	#descending
				max_depth = depth
				max_depth_time = timestamp
				if speed > max_descent_speed:
					max_descent_speed = speed
					max_descent_speed_time = timestamp
			else:	#ascending
				if speed > max_ascent_speed:
					max_ascent_speed = speed
					max_ascent_speed_time = timestamp
			#print 'index=%d, timestamp=%d, depth=%.2f, speed=%.2f, interval_begin_index=%d' % (index, timestamp, depth, speed, interval_begin_index)

			interval_begin_index = int(index - STROKE_MEASURE_INTERVAL / self.seconds_per_sample)
			if interval_begin_index >= 0:	#far enough into the dive to have a stroke speed measure interval
				ref_depth = self._sampledata[interval_begin_index][2]
				strokespeed = abs((depth - ref_depth) / STROKE_MEASURE_INTERVAL)
			stroke_speed.append((strokespeed, depth))
			#print 'index=%d, timestamp=%d, depth=%.2f, strokespeed=%.2f, interval_begin_index=%d' % (index, timestamp, depth, strokespeed, interval_begin_index)
		
		average_descent_speed = (max_depth / max_depth_time)
		average_ascent_speed  = (max_depth / (timestamp - max_depth_time))

		return average_descent_speed, max_descent_speed, max_descent_speed_time,\
		       average_ascent_speed , max_ascent_speed , max_ascent_speed_time ,\
		       stroke_speed


	def _bottomTime(self):
		bottom_time_begin, bottom_time_end = None, None 

		for _, timestamp, depth in self._sampledata:
			if depth >= self.max_depth - BOTTOM_TIME_THRESHOLD:
				if not bottom_time_begin:
					bottom_time_begin = timestamp
				bottom_time_end = timestamp

		return bottom_time_end - bottom_time_begin	#number of seconds max X meters away from max_depth	


	def _strokes(self):
		strokes_descent = []
		strokes_ascent = []
		freefall_depth, freefall_time = self.stroke_speed[0][1], 0
		floatup_depth, floatup_time = self.max_depth, self.max_depth_time

		max_depth_time = int(self.max_depth_time)

		#Compute descent statistics
		
		#print '\tDescent stroke speed:'
		#for i, speed_depth in enumerate(self.stroke_speed[:max_depth_time]):
		#	print "%02d:%02d, speed=%.2f m/s, depth=%.2f meter" % (i / 60, i % 60, speed_depth[0], speed_depth[1])
			
		t = 0
		last_speed, last_speed = self.stroke_speed[t]
		has_slowed_down = True
		while t < max_depth_time:
			speed, depth = self.stroke_speed[t]
			#if depth >= freefall_depth + STROKE_MAX_DURATION:
			#	print 'hit freefall at/before %02d:%02d' % (t / 60, t % 60)
			if has_slowed_down and speed > last_speed + STROKE_MIN_SPEED_INCREMENT and depth < freefall_depth + STROKE_MAX_DURATION and depth < FREEFALL_ABSOLUTE_DEPTH:
				stroke_time = t - 1	#we notice the speedup now but so the stroke started earlier
				#print 'Descent stroke no. %d from speed %.2f -> %.2f at %.02fm (%02d:%02d)' % (len(strokes_descent)+1, last_speed, speed, last_depth, stroke_time / 60, stroke_time % 60)
				freefall_depth = last_depth
				freefall_time = stroke_time
				strokes_descent.append((last_depth, stroke_time))	#XXX or should this be last_depth?
				has_slowed_down = False	#Wait for a slowdown before considering new strokes
			if speed < last_speed:
				#if not has_slowed_down:
				#	print 'has_slowed_down at %02d:%02d' % (t / 60, t % 60)
				has_slowed_down = True
			last_speed, last_depth = speed, depth
			t += 1
		#print '%d strokes during descent (freefall from %.2f meter)' % (len(strokes_descent), freefall_depth)
		#print
		
		#Compute ascent statistics
		
		#print 'Ascent stroke speed:'
		#for i, speed_depth in enumerate(self.stroke_speed[max_depth_time:-FLOATUP_MINIMUM_TIME]):
		#	print "%02d:%02d, speed=%.2f, depth=%.2f meter" % ((max_depth_time + i) / 60, (max_depth_time + i) % 60, speed_depth[0], speed_depth[1])
		#print
		
		t = max_depth_time
		last_speed, last_depth = self.stroke_speed[t]
		has_slowed_down = True
		while t < self.dive_time - FLOATUP_MINIMUM_TIME:
			speed, depth = self.stroke_speed[t]
			if has_slowed_down and last_depth <= self.max_depth - TURN_PULL_THRESHOLD and speed > last_speed + STROKE_MIN_SPEED_INCREMENT and depth < floatup_depth + STROKE_MAX_DURATION:
				stroke_time = t - 1	#we notice the speedup now but so the stroke started earlier
				#print 'Ascent stroke no. %d from speed %.2f -> %.2f at %.02fm (%02d:%02d)' % (len(strokes_ascent)+1, last_speed, speed, last_depth, stroke_time / 60, stroke_time % 60)
				floatup_depth = last_depth
				floatup_time = stroke_time
				strokes_ascent.append((last_depth, stroke_time))	#XXX or should this be last_depth?
				has_slowed_down = False	#Wait for a slowdown before considering new strokes
			if speed < last_speed:
				has_slowed_down = True
			last_speed, last_depth = speed, depth
			t += 1
		#print '%d strokes during ascent (floatup from %.2f meter)' % (len(strokes_ascent), floatup_depth)
		#print

		return freefall_depth, freefall_time, strokes_descent, strokes_ascent, floatup_depth, floatup_time


	def metersPerStroke(self, strokes):
		if len(strokes) < 2:
			return 0
		return abs(strokes[-1][0] - strokes[0][0]) / (len(strokes) -1)


	def secondsPerStroke(self, strokes):
		if len(strokes) < 2:
			return 0
		return abs(float(strokes[-1][1] - strokes[0][1])) / (len(strokes) -1)
