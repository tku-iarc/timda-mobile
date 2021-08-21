#########################################################
#                                                       #
#       QUANTUM GENETIC ALGORITHM (24.05.2016)          #
#                                                       #
#               R. Lahoz-Beltra                         #
#                                                       #
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND   #
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT #
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY #
# AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  #
# THE SOFWTARE CAN BE USED BY ANYONE SOLELY FOR THE     #
# PURPOSES OF EDUCATION AND RESEARCH.                   #
#                                                       #
#########################################################
import math
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from numpy import testing
from numpy.core.fromnumeric import ptp

#########################################################
# ALGORITHM PARAMETERS                                  #
#########################################################
N = 50                  # Define here the population size
Genome = 22              # Define here the chromosome length
generation_max = 450    # Define here the maximum number of
# generations/iterations

#########################################################
# VARIABLES ALGORITHM                                   #
#########################################################
popSize = N+1
genomeLength = Genome+1
top_bottom = 3
QuBitZero = np.array([[1], [0]])
QuBitOne = np.array([[0], [1]])
AlphaBeta = np.empty([top_bottom])
fitness = np.empty([popSize])
probability = np.empty([popSize])
# qpv: quantum chromosome (or population vector, QPV)
qpv = np.empty([popSize, genomeLength, top_bottom])
nqpv = np.empty([popSize, genomeLength, top_bottom])
# chromosome: classical chromosome
chromosome = np.empty([popSize, genomeLength], dtype=np.int)
child1 = np.empty([popSize, genomeLength, top_bottom])
child2 = np.empty([popSize, genomeLength, top_bottom])
best_chrom = np.empty([generation_max])

# Initialization global variables
theta = 0
iteration = 0
the_best_chrom = 0
generation = 0
#########################################################
# QUANTUM POPULATION INITIALIZATION                     #
#########################################################
test = []
obj = [[0, 0], [-14, 60], [-18, 59], [39, 41], [85, 16],
       [16, 96], [96, 55], [75, 36], [11, 23], [75, 8], [32, 18]]

rt = np.zeros(int(math.pow(2, Genome)))


def Init_sample():
    data = np.loadtxt('output_2.dat')
    for i in range(int(math.pow(2, Genome))):
        rt[i] = 99999999999
    # plot the first column as x, and second column as y
    rt_tmp = data[:, 1]
    k = 0
    for j in rt_tmp:
        rt[k] = j
        print(rt[k])
        k += 1


def Init_population():
    # Hadamard gate
    r2 = math.sqrt(2.0)
    h = np.array([[1/r2, 1/r2], [1/r2, -1/r2]])
    # Rotation Q-gate
    theta = 0
    rot = np.empty([2, 2])
    # Initial population array (individual x chromosome)
    i = 1
    j = 1
    for i in range(1, popSize):
        for j in range(1, genomeLength):
            theta = np.random.uniform(0, 1)*90
            theta = math.radians(theta)
            rot[0, 0] = math.cos(theta)
            rot[0, 1] = -math.sin(theta)
            rot[1, 0] = math.sin(theta)
            rot[1, 1] = math.cos(theta)
            AlphaBeta[0] = rot[0, 0] * \
                (h[0][0]*QuBitZero[0])+rot[0, 1]*(h[0][1]*QuBitZero[1])
            AlphaBeta[1] = rot[1, 0] * \
                (h[1][0]*QuBitZero[0])+rot[1, 1]*(h[1][1]*QuBitZero[1])
            # alpha squared
            qpv[i, j, 0] = np.around(2*pow(AlphaBeta[0], 2), 2)
            # beta squared
            qpv[i, j, 1] = np.around(2*pow(AlphaBeta[1], 2), 2)

    # i = 0
    # for j in range(1, 10):
    #     route = distance((obj[j][0]-obj[0][0]), (obj[j][1]-obj[0][1]))
    #     print("j is:", j)
    #     for l in range(1, 10):
    #         if l == j:
    #             continue
    #         print("l is:", l)
    #         route = route + \
    #             distance((obj[l][0]-obj[j][0]), (obj[l][1]-obj[j][1]))
    #         for a in range(1, 10):
    #             if a == l or a == j:
    #                 continue
    #             print("a is:", a)
    #             print(j, l, a, "\n")
    #             route = route + \
    #                 distance((obj[a][0]-obj[l][0]),
    #                          (obj[a][1]-obj[l][1]))
    #             route = route + \
    #                 distance((obj[0][0]-obj[a][0]),
    #                          (obj[0][1]-obj[a][1]))
    #             rt[i] = route
    #             i += 1

    # k = 0
    # for i in range(1, 11):
    #     route_i = distance((obj[i][0]-obj[0][0]), (obj[i][1]-obj[0][1]))
    #     for j in range(1, 11):
    #         if j == i:
    #             continue
    #         route_j = route_i + \
    #             distance((obj[j][0]-obj[i][0]), (obj[j][1]-obj[i][1]))
    #         for l in range(1, 11):
    #             if l == i or l == j:
    #                 continue
    #             route_l = route_j + \
    #                 distance((obj[l][0]-obj[j][0]), (obj[l][1]-obj[j][1]))
    #             for a in range(1, 11):
    #                 if a == i or a == j or a == l:
    #                     continue
    #                 route_a = route_l + \
    #                     distance((obj[a][0]-obj[l][0]), (obj[a][1]-obj[l][1]))
    #                 for b in range(1, 11):
    #                     if b == i or b == j or b == l or b == a:
    #                         continue
    #                     route_b = route_a + \
    #                         distance((obj[b][0]-obj[a][0]),
    #                                  (obj[b][1]-obj[a][1]))
    #                     for c in range(1, 11):
    #                         if c == i or c == j or c == l or c == a or c == b:
    #                             continue
    #                         route_c = route_b + \
    #                             distance((obj[c][0]-obj[b][0]),
    #                                      (obj[c][1]-obj[b][1]))
    #                         for d in range(1, 11):
    #                             if d == i or d == j or d == l or d == a or d == b or d == c:
    #                                 continue
    #                             route_d = route_c + \
    #                                 distance((obj[d][0]-obj[c][0]),
    #                                          (obj[d][1]-obj[c][1]))
    #                             for e in range(1, 11):
    #                                 if e == i or e == j or e == l or e == a or e == b or e == c or e == d:
    #                                     continue
    #                                 route_e = route_d + \
    #                                     distance(
    #                                         (obj[e][0]-obj[d][0]), (obj[e][1]-obj[d][1]))
    #                                 for f in range(1, 11):
    #                                     if f == i or f == j or f == l or f == a or f == b or f == c or f == d or f == e:
    #                                         continue
    #                                     route_f = route_e + \
    #                                         distance(
    #                                             (obj[f][0]-obj[e][0]), (obj[f][1]-obj[e][1]))
    #                                     for g in range(1, 11):
    #                                         if g == i or g == j or g == l or g == a or g == b or g == c or g == d or g == e or g == f:
    #                                             continue
    #                                         route_g = route_f + \
    #                                             distance(
    #                                                 (obj[g][0]-obj[f][0]), (obj[g][1]-obj[f][1]))
    #                                         route_0 = route_g + \
    #                                             distance(
    #                                                 (obj[0][0]-obj[g][0]), (obj[0][1]-obj[g][1]))
    #                                         print(i, j, l, a, b, c, d, e, f, g)
    #                                         print("")
    #                                         fi = open("output_2.dat", "a")
    #                                         # f.write(str(generation)+" "+str(fitness_average)+"\n")
    #                                         fi.write(
    #                                             str(k)+" "+str(route_0)+"\n")
    #                                         fi.write(" \n")
    #                                         fi.close()
    #                                         rt[k] = route_0
    #                                         print(route_0)

    #                                         k += 1


def distance(x, y):
    r = math.sqrt(pow(x, 2) * pow(y, 2))
    return r


#########################################################
# SHOW QUANTUM POPULATION                               #
#########################################################


def Show_population():
    i = 1
    j = 1
    for i in range(1, popSize):
        print()
        print()
        print("qpv = ", i, " : ")
        print()
        for j in range(1, genomeLength):
            print(qpv[i, j, 0], end="")
            print(" ", end="")
        print()
        for j in range(1, genomeLength):
            print(qpv[i, j, 1], end="")
            print(" ", end="")
    print()

#########################################################
# MAKE A MEASURE                                        #
#########################################################
# p_alpha: probability of finding qubit in alpha state


def Measure(p_alpha):
    for i in range(1, popSize):
        print()
        for j in range(1, genomeLength):
            if p_alpha <= qpv[i, j, 0]:
                chromosome[i, j] = 0
            else:
                chromosome[i, j] = 1
            print(chromosome[i, j], " ", end="")
        print()

#########################################################
# FITNESS EVALUATION                                    #
#########################################################


def Fitness_evaluation(generation):
    i = 1
    j = 1
    fitness_total = 0
    sum_sqr = 0
    fitness_average = 0
    variance = 0
    for i in range(1, popSize):
        fitness[i] = 0

#########################################################
# Define your problem in this section. For instance:    #
#                                                       #
# Let f(x)=abs(x-5/2+sin(x)) be a function that takes   #
# values in the range 0<=x<=15. Within this range f(x)  #
# has a maximum value at x=11 (binary is equal to 1011) #
#########################################################
    for i in range(1, popSize):
        x = 0
        for j in range(1, genomeLength):
            # translate from binary to decimal value
            x = x + chromosome[i, j]*pow(2, genomeLength-j-1)
            # replaces the value of x in the function f(x)
            # y = np.fabs((x-5)/(2+np.sin(x)))
            # the fitness value is calculated below:
            # (Note that in this example is multiplied
            # by a scale value, e.g. 100)
            # print("x is", x, "\n")
            y = rt[x]
            # print("y is", y, "\n")
            fitness[i] = y * 100
#########################################################

        print("fitness", i, "=", fitness[i])
        fitness_total = fitness_total + fitness[i]
    fitness_average = fitness_total/N
    i = 1
    while i <= N:
        # sum_sqr = sum_sqr+pow(fitness[i]-fitness_average, 2)
        sum_sqr = sum_sqr+pow(fitness[i]-fitness_average, 2)
        i = i+1
    variance = sum_sqr/N
    if variance <= 1.0e-4:
        variance = 0.0
    # Best chromosome selection
    the_best_chrom = 0
    fitness_max = fitness[1]
    for i in range(1, popSize):
        if fitness[i] <= fitness_max:
            fitness_max = fitness[i]
            the_best_chrom = i
    best_chrom[generation] = the_best_chrom
    # Statistical output
    print("the best num is:", the_best_chrom)
    print("the distance is :", fitness_max/100)
    f = open("output.dat", "a")
    # f.write(str(generation)+" "+str(fitness_average)+"\n")
    f.write(str(generation)+" "+str(fitness_max/100)+"\n")
    f.write(" \n")
    f.close()
    if generation == 449:
        return fitness_max/100
    else:
        return 0
    # print("Population size = ", popSize - 1)
    # print("mean fitness = ", fitness_average)
    # print("variance = ", variance, "\n",
    #       " Std. deviation = ", math.sqrt(variance))
    # print("fitness max = ", best_chrom[generation])
    # print("fitness sum = ", fitness_total)

#########################################################
# QUANTUM ROTATION GATE                                 #
#########################################################


def rotation():
    rot = np.empty([2, 2])
    # Lookup table of the rotation angle
    for i in range(1, popSize):
        for j in range(1, genomeLength):
            if fitness[i] < fitness[int(best_chrom[generation])]:
              # if chromosome[i,j]==0 and chromosome[best_chrom[generation],j]==0:
                if chromosome[i, j] == 0 and chromosome[int(best_chrom[generation]), j] == 1:
                    # Define the rotation angle: delta_theta (e.g. 0.0785398163)
                    delta_theta = 0.0785398163
                    rot[0, 0] = math.cos(delta_theta)
                    rot[0, 1] = -math.sin(delta_theta)
                    rot[1, 0] = math.sin(delta_theta)
                    rot[1, 1] = math.cos(delta_theta)
                    nqpv[i, j, 0] = (rot[0, 0]*qpv[i, j, 0]) + \
                        (rot[0, 1]*qpv[i, j, 1])
                    nqpv[i, j, 1] = (rot[1, 0]*qpv[i, j, 0]) + \
                        (rot[1, 1]*qpv[i, j, 1])
                    qpv[i, j, 0] = round(nqpv[i, j, 0], 2)
                    qpv[i, j, 1] = round(1-nqpv[i, j, 0], 2)
                if chromosome[i, j] == 1 and chromosome[int(best_chrom[generation]), j] == 0:
                    # Define the rotation angle: delta_theta (e.g. -0.0785398163)
                    delta_theta = -0.0785398163
                    rot[0, 0] = math.cos(delta_theta)
                    rot[0, 1] = -math.sin(delta_theta)
                    rot[1, 0] = math.sin(delta_theta)
                    rot[1, 1] = math.cos(delta_theta)
                    nqpv[i, j, 0] = (rot[0, 0]*qpv[i, j, 0]) + \
                        (rot[0, 1]*qpv[i, j, 1])
                    nqpv[i, j, 1] = (rot[1, 0]*qpv[i, j, 0]) + \
                        (rot[1, 1]*qpv[i, j, 1])
                    qpv[i, j, 0] = round(nqpv[i, j, 0], 2)
                    qpv[i, j, 1] = round(1-nqpv[i, j, 0], 2)
              # if chromosome[i,j]==1 and chromosome[best_chrom[generation],j]==1:

#########################################################
# X-PAULI QUANTUM MUTATION GATE                         #
#########################################################
# pop_mutation_rate: mutation rate in the population
# mutation_rate: probability of a mutation of a bit


def mutation(pop_mutation_rate, mutation_rate):

    for i in range(1, popSize):
        up = np.random.random_integers(100)
        up = up/100
        if up <= pop_mutation_rate:
            for j in range(1, genomeLength):
                um = np.random.random_integers(100)
                um = um/100
                if um <= mutation_rate:
                    nqpv[i, j, 0] = qpv[i, j, 1]
                    nqpv[i, j, 1] = qpv[i, j, 0]
                else:
                    nqpv[i, j, 0] = qpv[i, j, 0]
                    nqpv[i, j, 1] = qpv[i, j, 1]
        else:
            for j in range(1, genomeLength):
                nqpv[i, j, 0] = qpv[i, j, 0]
                nqpv[i, j, 1] = qpv[i, j, 1]
    for i in range(1, popSize):
        for j in range(1, genomeLength):
            qpv[i, j, 0] = nqpv[i, j, 0]
            qpv[i, j, 1] = nqpv[i, j, 1]

#########################################################
# PERFORMANCE GRAPH                                     #
#########################################################
# Read the Docs in http://matplotlib.org/1.4.1/index.html


def plot_Output():
    data = np.loadtxt('best_result.dat')
    # plot the first column as x, and second column as y
    y = data[:, 0]
    x = data[:, 1]
    # f = plt.figure()
    plt.show()
    plt.plot(y, x)
    plt.xlabel('Exercies times')
    plt.ylabel('the best distance')
    plt.xlim(0, 50)
    plt.show()

########################################################
#                                                      #
# MAIN PROGRAM                                         #
#                                                      #
########################################################


def Q_GA():
    generation = 0
    print("============== GENERATION: ", generation,
          " =========================== ")
    print()

    Init_population()
    Show_population()
    Measure(0.5)
    Fitness_evaluation(generation)
    for i in range(0, popSize):
        if i == 0:
            for j in range(0, genomeLength):
                chromosome[i, j] = 0
        chromosome[i, 0] = 0
    while (generation < generation_max-1):
        print("The best of generation [",
              generation, "] ", best_chrom[generation])
        print()
        print("============== GENERATION: ", generation +
              1, " =========================== ")
        print()
        rotation()
        mutation(0.01, 0.001)
        generation = generation+1
        Measure(0.5)
        re = Fitness_evaluation(generation)
    return re


print("""QUANTUM GENETIC ALGORITHM""")
f = open("output.dat", "w")
# fi = open("output_2.dat", "w")
fi3 = open("best_result.dat", "w")


input("Press Enter to continue...")
Init_sample()
for i in range(50):
    max = Q_GA()
    fi3 = open("best_result.dat", "a")
    # f.write(str(generation)+" "+str(fitness_average)+"\n")
    fi3.write(str(i)+" "+str(max)+"\n")
    fi3.write(" \n")
    fi3.close()
# Init_population()
# print(rt)
plot_Output()
