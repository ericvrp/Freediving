#!/usr/bin/python

from ProfileCollection import ProfileCollection

	
def main(udcf_string):
	n_profiles = 0
	for profile in ProfileCollection(udcf_string).diveProfiles():
		print '%s - %s' % (profile.dive_timestamp, profile.dive_location)
		print '\tDive time          : %02d:%02d' % (profile.dive_time / 60, profile.dive_time % 60)
		print '\tMax depth          : %.2f meter (%02d:%02d)' % (profile.max_depth, profile.max_depth_time / 60, profile.max_depth_time % 60)
		print '\tBottom time        : %02d:%02d' % (profile.bottom_time / 60, profile.bottom_time % 60)
		print '\tDescent speed      : %.1f m/s (avg), %.1f m/s (max at %02d:%02d)' % (profile.average_descent_speed, profile.max_descent_speed, profile.max_descent_speed_time / 60, profile.max_descent_speed_time % 60)
		print '\tAscent  speed      : %.1f m/s (avg), %.1f m/s (max at %02d:%02d)' % (profile.average_ascent_speed , profile.max_ascent_speed , profile.max_ascent_speed_time  / 60, profile.max_ascent_speed_time  % 60)
		print '\tStrokes on descent : %d (%.2f meter/stroke (avg)) (%.2f seconds/stroke (avg))' % (len(profile.strokes_descent), profile.metersPerStroke(profile.strokes_descent), profile.secondsPerStroke(profile.strokes_descent))
		#print profile.strokes_descent
		print '\tFreefall at        : %.2f meter (%02d:%02d)' % (profile.freefall_depth, profile.freefall_time / 60, profile.freefall_time % 60)
		print '\tStrokes on ascent  : %d (%.2f meter/stroke (avg)) (%.2f seconds/stroke (avg))' % (len(profile.strokes_ascent), profile.metersPerStroke(profile.strokes_ascent), profile.secondsPerStroke(profile.strokes_ascent))
		#print profile.strokes_ascent
		print '\tFloat to surface at: %.2f meter (%02d:%02d)' % (profile.floatup_depth, profile.floatup_time / 60, profile.floatup_time % 60)
		print
		n_profiles += 1
	if n_profiles == 0:
		print 'Warning: No valid udcf dive profile found in...\n%s' % udcf_string


if __name__ == '__main__':
	import	sys, os, cgi, cgitb

	form = cgi.FieldStorage()
	if form.has_key('userfile'):
		print 'Content-Type: text/html'	# HTML is following
		print								# blank line, end of headers
		print '<pre>'
		cgitb.enable()
		names = [form['userfile'].file.read()]
	elif len(sys.argv) == 1:
		names = [sys.stdin.read()]
	else:
		names = sys.argv[1:]
		
	for name in names:
		udcf_strings = []
		if os.path.isfile(name):
			udcf_strings.append(file(name))
		elif os.path.isdir(name):
			for root, dirs, files in os.walk(name):
				for f in files:
					if f.endswith('.udcf'):
						if f.endswith('_X1.udcf'):
							continue
						udcf_strings.append(file(os.path.join(root, f)))
		else:
			udcf_strings.append(name)

		for udcf_string in udcf_strings:
			main(udcf_string)
